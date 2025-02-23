class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Set();
  }

  startMeasure(name) {
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name) {
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = performance.getEntriesByName(name);
      const duration = entries[entries.length - 1].duration;
      
      this.metrics[name] = duration;
      this.notifyObservers({ name, duration });
    }
  }

  addObserver(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

 notifyObservers(data) {
    this.observers.forEach(callback => callback(data));
  }
}

export const performanceMonitor = new PerformanceMonitor();