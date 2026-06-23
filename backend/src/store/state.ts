/** biome-ignore-all lint/suspicious/noConsole: console.log is used for status logging */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: simulation methods have higher complexity */
import { EventEmitter } from 'events';
import type { MetricPoint, NetworkAlert, NetworkEdge, NetworkNode } from '../types';
import { initialAlerts, initialEdges, initialNodes } from './mockData';

export class NetworkState extends EventEmitter {
  public nodes: NetworkNode[];
  public edges: NetworkEdge[];
  public alerts: NetworkAlert[];
  public metricsHistory: Map<string, MetricPoint[]>;
  private rebootsInProgress: Map<string, NodeJS.Timeout>;

  private static readonly HISTORY_LIMIT = 60; // ~5 min at 5s interval

  constructor() {
    super();
    // Clone structures to avoid mutating imported constants directly
    this.nodes = JSON.parse(JSON.stringify(initialNodes));
    this.edges = JSON.parse(JSON.stringify(initialEdges));
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.rebootsInProgress = new Map();
    this.metricsHistory = new Map();
  }

  public rebootNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node || node.status === 'offline') return;

    console.log(`Reboot requested for node: ${nodeId}`);

    // Clear any existing reboot timeouts for safety
    const existingTimeout = this.rebootsInProgress.get(nodeId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Mark node offline
    node.status = 'offline';
    node.cpu = 0;
    node.ram = 0;
    node.temp = 0;
    node.traffic = 0;

    // Break connections visually (set edge traffic connected to this node to 0)
    this.edges.forEach((edge) => {
      if (edge.source === nodeId || edge.target === nodeId) {
        edge.currentUsage = 0;
        edge.status = 'inactive';
      }
    });

    // Add alert
    const alertId = `a-reboot-${Date.now()}`;
    const newAlert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId: node.id,
      nodeLabel: node.label,
      severity: 'info',
      message: `Устройство ${node.label} (${node.ip}) отправлено на перезагрузку.`,
      acknowledged: false,
    };
    this.alerts.unshift(newAlert);

    // Emit changes
    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', newAlert);

    // Set timer to come back online after 5 seconds
    const timeout = setTimeout(() => {
      const freshNode = this.nodes.find((n) => n.id === nodeId);
      if (freshNode) {
        freshNode.status = 'online';
        freshNode.cpu = 15;
        freshNode.ram = 25;
        freshNode.temp = 35;
        console.log(`Node back online: ${nodeId}`);

        // Restore edges
        this.edges.forEach((edge) => {
          if (edge.source === nodeId || edge.target === nodeId) {
            const counterpartId = edge.source === nodeId ? edge.target : edge.source;
            const counterpart = this.nodes.find((n) => n.id === counterpartId);
            if (counterpart && counterpart.status !== 'offline') {
              edge.status = 'active';
              edge.currentUsage = Math.floor(Math.random() * 50) + 10;
            }
          }
        });

        // Add recovery alert
        const recoveryAlert: NetworkAlert = {
          id: `a-recovery-${Date.now()}`,
          timestamp: new Date().toISOString(),
          nodeId: freshNode.id,
          nodeLabel: freshNode.label,
          severity: 'info',
          message: `Устройство ${freshNode.label} (${freshNode.ip}) успешно загрузилось и в сети.`,
          acknowledged: false,
        };
        this.alerts.unshift(recoveryAlert);

        this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
        this.emit('new-alert', recoveryAlert);
      }
      this.rebootsInProgress.delete(nodeId);
    }, 5000);

    this.rebootsInProgress.set(nodeId, timeout);
  }

  public ackAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit('alerts-updated', this.alerts);
    }
  }

  public ackAllAlerts(): void {
    this.alerts.forEach((a) => {
      a.acknowledged = true;
    });
    this.emit('alerts-updated', this.alerts);
  }

  public clearAlerts(): void {
    this.alerts = [];
    this.emit('alerts-updated', this.alerts);
  }

  public addNode(payload: {
    id?: string;
    label?: string;
    type?: NetworkNode['type'];
    ip?: string;
    mac?: string;
  }): void {
    const newNode: NetworkNode = {
      id: payload.id || `n-${Date.now()}`,
      label: payload.label || 'New Device',
      type: payload.type || 'client',
      status: 'online',
      ip: payload.ip || `10.0.2.${Math.floor(Math.random() * 150) + 101}`,
      mac: payload.mac || `00:1A:2B:3C:4D:${Math.floor(Math.random() * 90) + 10}`,
      cpu: 5,
      ram: 10,
      temp: 30,
      traffic: 0,
    };
    this.nodes.push(newNode);

    // Info alert
    const alert: NetworkAlert = {
      id: `a-add-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nodeId: newNode.id,
      nodeLabel: newNode.label,
      severity: 'info',
      message: `Добавлено новое устройство: ${newNode.label} (${newNode.ip})`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public connectNodes(payload: { source: string; target: string; bandwidth?: number }): void {
    const { source, target, bandwidth } = payload;
    const edgeId = `e-${source}-${target}`;

    // Check if edge already exists
    if (
      this.edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source),
      )
    ) {
      return;
    }

    const newEdge: NetworkEdge = {
      id: edgeId,
      source,
      target,
      bandwidth: bandwidth || 1,
      currentUsage: 5,
      latency: Math.floor(Math.random() * 5) + 1,
      status: 'active',
    };
    this.edges.push(newEdge);

    // Info alert
    const sourceNode = this.nodes.find((n) => n.id === source);
    const targetNode = this.nodes.find((n) => n.id === target);
    const alert: NetworkAlert = {
      id: `a-conn-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nodeId: source,
      nodeLabel: sourceNode?.label || 'Source',
      severity: 'info',
      message: `Создано новое сетевое соединение между ${sourceNode?.label} и ${targetNode?.label}`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public disconnectNodes(edgeId: string): void {
    const index = this.edges.findIndex((e) => e.id === edgeId);
    if (index !== -1) {
      const edge = this.edges[index];
      this.edges.splice(index, 1);

      const srcNode = this.nodes.find((n) => n.id === edge.source);
      const tgtNode = this.nodes.find((n) => n.id === edge.target);

      const alert: NetworkAlert = {
        id: `a-disconn-${Date.now()}`,
        timestamp: new Date().toISOString(),
        nodeId: edge.source,
        nodeLabel: srcNode?.label || 'Node',
        severity: 'warning',
        message: `Удалена сетевая связь между ${srcNode?.label} и ${tgtNode?.label}`,
        acknowledged: false,
      };
      this.alerts.unshift(alert);

      this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
      this.emit('new-alert', alert);
    }
  }

  public deleteNode(nodeId: string): void {
    const nodeIndex = this.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      const node = this.nodes[nodeIndex];
      this.nodes.splice(nodeIndex, 1);

      // Remove edges connected to this node
      this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

      const rebootTimeout = this.rebootsInProgress.get(nodeId);
      if (rebootTimeout) {
        clearTimeout(rebootTimeout);
        this.rebootsInProgress.delete(nodeId);
      }

      const alert: NetworkAlert = {
        id: `a-del-${Date.now()}`,
        timestamp: new Date().toISOString(),
        nodeId: nodeId,
        nodeLabel: node.label,
        severity: 'warning',
        message: `Устройство ${node.label} (${node.ip}) удалено из топологии.`,
        acknowledged: false,
      };
      this.alerts.unshift(alert);

      this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
      this.emit('new-alert', alert);
    }
  }

  public tickTelemetry(): void {
    // Update CPU, RAM, Temp and Traffic for each online node
    this.nodes.forEach((node) => {
      if (node.status === 'offline') return;

      // Random walk with boundaries
      // CPU
      const cpuDelta = Math.floor(Math.random() * 11) - 5; // -5 to +5
      node.cpu = Math.max(2, Math.min(99, node.cpu + cpuDelta));

      // RAM
      const ramDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2
      node.ram = Math.max(10, Math.min(95, node.ram + ramDelta));

      // Temp
      const tempDelta = Math.floor(Math.random() * 3) - 1; // -1 to +1
      let targetBaseTemp = node.type === 'server' ? 48 : node.type === 'router' ? 42 : 32;
      if (node.cpu > 80) targetBaseTemp += 8; // hotter under load
      node.temp = Math.max(
        20,
        Math.min(85, node.temp + tempDelta + (node.temp < targetBaseTemp ? 1 : -1)),
      );

      // Traffic (devices generate dynamic local traffic)
      const baseTraffic =
        node.type === 'router'
          ? 400
          : node.type === 'switch'
            ? 200
            : node.type === 'server'
              ? 100
              : 10;
      const trafficDelta =
        Math.floor(Math.random() * (baseTraffic * 0.2)) - Math.floor(baseTraffic * 0.1);
      node.traffic = Math.max(1, Math.floor(node.traffic + trafficDelta));

      // Node statuses based on load thresholds
      if (node.cpu > 90 || node.temp > 75) {
        node.status = 'error';
      } else if (node.cpu > 80 || node.temp > 65 || node.ram > 85) {
        node.status = 'warning';
      } else {
        node.status = 'online';
      }
    });

    // Calculate live edge usage based on node traffic updates
    this.edges.forEach((edge) => {
      const srcNode = this.nodes.find((n) => n.id === edge.source);
      const tgtNode = this.nodes.find((n) => n.id === edge.target);

      if (!srcNode || !tgtNode || srcNode.status === 'offline' || tgtNode.status === 'offline') {
        edge.currentUsage = 0;
        edge.status = 'inactive';
        return;
      }

      // Edge usage matches some dynamic transfer rate (correlated to nodes, capped by bandwidth)
      // 1 Gbps = 1000 Mbps
      const maxMbps = edge.bandwidth * 1000;

      // Simulate dynamic link activity
      let randomUsage = Math.floor(Math.random() * 40) + 10; // base random link activity
      if (edge.source === 'gw-01' || edge.target === 'gw-01') {
        randomUsage += Math.min(srcNode.traffic, tgtNode.traffic); // internet link correlates strongly to gateway traffic
      } else if (edge.source === 'cr-01' || edge.target === 'cr-01') {
        randomUsage += Math.floor((srcNode.traffic + tgtNode.traffic) / 3);
      } else if (srcNode.type === 'server' || tgtNode.type === 'server') {
        randomUsage += Math.max(srcNode.traffic, tgtNode.traffic);
      } else {
        randomUsage += Math.min(srcNode.traffic, tgtNode.traffic);
      }

      edge.currentUsage = Math.min(maxMbps - 10, randomUsage);

      if (edge.currentUsage <= 0) {
        edge.currentUsage = 5; // keep small heartbeat
      }

      // Congestion threshold: load > 80% of bandwidth
      const loadFactor = edge.currentUsage / maxMbps;
      if (loadFactor > 0.8) {
        edge.status = 'congested';
        edge.latency = Math.floor(Math.random() * 30) + 20; // high congestion causes latency spikes
      } else {
        edge.status = 'active';
        // baseline latency
        const baseLat = edge.source.includes('dev') || edge.target.includes('dev') ? 5 : 2;
        edge.latency = baseLat + (Math.random() > 0.8 ? 1 : 0);
      }
    });

    // Накапливаем историю метрик
    const now = new Date().toISOString();
    this.nodes.forEach((node) => {
      const point: MetricPoint = {
        timestamp: now,
        cpu: node.cpu,
        ram: node.ram,
        temp: node.temp,
        traffic: node.traffic,
      };
      const history = this.metricsHistory.get(node.id) || [];
      history.push(point);
      if (history.length > NetworkState.HISTORY_LIMIT) {
        history.shift();
      }
      this.metricsHistory.set(node.id, history);
    });

    // Emit the update
    this.emit('metrics-update', {
      nodes: this.nodes.map((n) => ({
        id: n.id,
        status: n.status,
        cpu: n.cpu,
        ram: n.ram,
        temp: n.temp,
        traffic: n.traffic,
      })),
      edges: this.edges.map((e) => ({
        id: e.id,
        currentUsage: e.currentUsage,
        latency: e.latency,
        status: e.status,
      })),
    });
  }

  public tickRandomAlert(): void {
    const onlineNodes = this.nodes.filter((n) => n.status !== 'offline');
    if (onlineNodes.length === 0) return;

    const randomNode = onlineNodes[Math.floor(Math.random() * onlineNodes.length)];
    let severity: 'warning' | 'critical' = 'warning';
    let message = '';

    const roll = Math.random();
    if (roll < 0.3) {
      // CPU spike
      severity = roll < 0.1 ? 'critical' : 'warning';
      message =
        severity === 'critical'
          ? `Критическая нагрузка на CPU устройства ${randomNode.label}: ${Math.floor(Math.random() * 9) + 90}%`
          : `Повышенная нагрузка на CPU устройства ${randomNode.label}: ${Math.floor(Math.random() * 10) + 80}%`;
      randomNode.cpu = severity === 'critical' ? 95 : 82;
    } else if (roll < 0.6) {
      // Temperature warning
      severity = roll < 0.4 ? 'critical' : 'warning';
      message =
        severity === 'critical'
          ? `ОПАСНОСТЬ ПЕРЕГРЕВА: Температура ${randomNode.label} составляет ${Math.floor(Math.random() * 10) + 78}°C!`
          : `Предупреждение: Температура ${randomNode.label} выше нормы: ${Math.floor(Math.random() * 5) + 68}°C`;
      randomNode.temp = severity === 'critical' ? 80 : 70;
    } else if (roll < 0.85) {
      // Latency / Packet Loss on an edge connected to it
      const nodeEdges = this.edges.filter(
        (e) => e.source === randomNode.id || e.target === randomNode.id,
      );
      if (nodeEdges.length > 0) {
        const randomEdge = nodeEdges[Math.floor(Math.random() * nodeEdges.length)];
        severity = 'warning';
        message = `Зафиксирована повышенная задержка на канале ${randomNode.label} <-> ${
          randomEdge.source === randomNode.id
            ? this.nodes.find((n) => n.id === randomEdge.target)?.label || 'Peer'
            : this.nodes.find((n) => n.id === randomEdge.source)?.label || 'Peer'
        }: ${Math.floor(Math.random() * 50) + 40} мс`;
        randomEdge.latency = 45;
        randomEdge.status = 'congested';
      } else {
        return;
      }
    } else {
      // Storage threshold on server
      const servers = this.nodes.filter((n) => n.type === 'server' && n.status !== 'offline');
      if (servers.length > 0) {
        const server = servers[Math.floor(Math.random() * servers.length)];
        severity = 'warning';
        message = `Дисковое пространство на сервере ${server.label} заполнено на ${Math.floor(Math.random() * 5) + 85}%`;
      } else {
        return;
      }
    }

    const alertId = `a-random-${Date.now()}`;
    const newAlert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId: randomNode.id,
      nodeLabel: randomNode.label,
      severity,
      message,
      acknowledged: false,
    };

    this.alerts.unshift(newAlert);
    this.emit('new-alert', newAlert);
  }

  public getMetricsHistory(nodeId?: string): Record<string, MetricPoint[]> {
    if (nodeId) {
      return { [nodeId]: this.metricsHistory.get(nodeId) || [] };
    }
    const result: Record<string, MetricPoint[]> = {};
    this.metricsHistory.forEach((points, id) => {
      result[id] = points;
    });
    return result;
  }

  public triggerDdos(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node || node.status === 'offline') return;

    node.cpu = 99;
    node.ram = 92;
    node.status = 'error';

    this.edges.forEach((edge) => {
      if (edge.source === nodeId || edge.target === nodeId) {
        edge.currentUsage = edge.bandwidth * 1000 - 15;
        edge.status = 'congested';
        edge.latency = Math.floor(Math.random() * 40) + 110;
      }
    });

    const alertId = `a-ddos-${Date.now()}`;
    const alert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId,
      nodeLabel: node.label,
      severity: 'critical',
      message: `КРИТИЧЕСКОЕ СОБЫТИЕ: Обнаружена DDoS-атака на устройство ${node.label} (${node.ip})! Нагрузка CPU 99%!`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public triggerOverheat(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node || node.status === 'offline') return;

    node.temp = 85;
    node.cpu = Math.max(node.cpu, 75);
    node.status = 'error';

    const alertId = `a-heat-${Date.now()}`;
    const alert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId,
      nodeLabel: node.label,
      severity: 'critical',
      message: `ОПАСНОСТЬ ПЕРЕГРЕВА: Температура устройства ${node.label} поднялась до 85°C! Вентилятор охлаждения неисправен!`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public triggerLatencySpike(edgeId: string): void {
    const edge = this.edges.find((e) => e.id === edgeId);
    if (!edge) return;

    edge.latency = 165;
    edge.status = 'congested';

    const srcNode = this.nodes.find((n) => n.id === edge.source);
    const tgtNode = this.nodes.find((n) => n.id === edge.target);

    const alertId = `a-lat-${Date.now()}`;
    const alert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId: edge.source,
      nodeLabel: srcNode?.label || 'Link',
      severity: 'warning',
      message: `Деградация линка: Зафиксирована высокая задержка (165 мс) на канале ${srcNode?.label || 'Source'} <-> ${tgtNode?.label || 'Target'}.`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public recoverAll(): void {
    this.nodes.forEach((node) => {
      if (node.status === 'offline') return;
      node.cpu = Math.floor(Math.random() * 20) + 10;
      node.ram = Math.floor(Math.random() * 20) + 30;
      node.temp = node.type === 'server' ? 42 : 36;
      node.status = 'online';
    });

    this.edges.forEach((edge) => {
      if (edge.status === 'inactive') return;
      edge.currentUsage = Math.floor(Math.random() * 40) + 15;
      edge.latency = edge.source.includes('dev') || edge.target.includes('dev') ? 5 : 2;
      edge.status = 'active';
    });

    const alertId = `a-rec-all-${Date.now()}`;
    const alert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId: '',
      nodeLabel: 'Система',
      severity: 'info',
      message: `Все аварийные метрики узлов и каналов успешно возвращены в штатный режим.`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public setTopology(payload: { nodes: NetworkNode[]; edges: NetworkEdge[] }): void {
    this.nodes = JSON.parse(JSON.stringify(payload.nodes));
    this.edges = JSON.parse(JSON.stringify(payload.edges));

    const alertId = `a-set-top-${Date.now()}`;
    const alert: NetworkAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      nodeId: '',
      nodeLabel: 'Система',
      severity: 'info',
      message: `Топология сети успешно восстановлена из резервной копии JSON.`,
      acknowledged: false,
    };
    this.alerts.unshift(alert);

    this.emit('topology-changed', { nodes: this.nodes, edges: this.edges });
    this.emit('new-alert', alert);
  }

  public cleanup(): void {
    for (const timeout of this.rebootsInProgress.values()) {
      clearTimeout(timeout);
    }
    this.rebootsInProgress.clear();
  }
}

export const networkState = new NetworkState();
