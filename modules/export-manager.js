/**
 * export-manager.js — Exportar progreso a múltiples formatos
 * Soporta: JSON, CSV, HTML report
 */

const exportManager = {
  /**
   * Generar reporte HTML completo
   */
  generateHTMLReport() {
    const progress = quizEngine.getProgress();
    const stats = quizEngine.getStats();

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Mastery — Reporte de Progreso</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #1e293b;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            color: #64748b;
            font-size: 1.1em;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
            text-align: center;
        }
        .stat-card h3 {
            color: #3b82f6;
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            color: #64748b;
            font-size: 0.95em;
        }
        .levels {
            margin-bottom: 40px;
        }
        .levels h2 {
            color: #1e293b;
            margin-bottom: 20px;
            font-size: 1.5em;
        }
        .level-card {
            background: #f8fafc;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .level-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .level-title {
            font-size: 1.2em;
            font-weight: 600;
            color: #1e293b;
        }
        .level-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .badge-completed {
            background: #dcfce7;
            color: #166534;
        }
        .badge-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .level-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 0.95em;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
        }
        .detail-label {
            color: #64748b;
        }
        .detail-value {
            font-weight: 600;
            color: #1e293b;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            transition: width 0.3s ease;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9em;
        }
        .timestamp {
            color: #94a3b8;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Claude Code Mastery</h1>
            <p>Reporte de Progreso del Curso</p>
            <p class="timestamp">Generado: ${new Date().toLocaleString('es-ES')}</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <h3>${stats.completedLevels}/${stats.totalLevels}</h3>
                <p>Niveles Completados</p>
            </div>
            <div class="stat-card">
                <h3>${stats.avgQuizScore}%</h3>
                <p>Puntuación Promedio</p>
            </div>
            <div class="stat-card">
                <h3>${Object.keys(progress.quizResults).length}</h3>
                <p>Quizzes Completados</p>
            </div>
            <div class="stat-card">
                <h3>${new Date(progress.startDate).toLocaleDateString('es-ES')}</h3>
                <p>Fecha de Inicio</p>
            </div>
        </div>

        <div class="levels">
            <h2>Detalles por Nivel</h2>
            ${Object.entries(stats.levels).map(([level, data]) => `
                <div class="level-card">
                    <div class="level-header">
                        <span class="level-title">Nivel ${level}: ${['Fundamentos', 'Avanzado', 'Experto', 'Maestría'][level-1]}</span>
                        <span class="level-badge ${data.completed ? 'badge-completed' : 'badge-pending'}">
                            ${data.completed ? '✅ Completado' : '⏳ En progreso'}
                        </span>
                    </div>
                    <div class="level-details">
                        <div class="detail-item">
                            <span class="detail-label">Puntuación Quiz:</span>
                            <span class="detail-value">${data.quizScore}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Misión:</span>
                            <span class="detail-value">${data.missionStatus === 'completed' ? '✅ Completada' : '⏳ Pendiente'}</span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.quizScore}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Curso: Claude Code Mastery v1.0.0</p>
            <p>Plataforma: SPA interactiva | Generado automáticamente</p>
        </div>
    </div>
</body>
</html>
    `;

    return html;
  },

  /**
   * Descargar archivo (usado para JSON, CSV, HTML)
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Exportar a JSON
   */
  exportJSON() {
    const content = quizEngine.exportJSON();
    const filename = `claude-mastery-progress-${new Date().toISOString().split('T')[0]}.json`;
    this.downloadFile(content, filename, 'application/json');
  },

  /**
   * Exportar a CSV
   */
  exportCSV() {
    const content = quizEngine.exportCSV();
    const filename = `claude-mastery-progress-${new Date().toISOString().split('T')[0]}.csv`;
    this.downloadFile(content, filename, 'text/csv');
  },

  /**
   * Exportar a HTML (reporte)
   */
  exportHTML() {
    const content = this.generateHTMLReport();
    const filename = `claude-mastery-reporte-${new Date().toISOString().split('T')[0]}.html`;
    this.downloadFile(content, filename, 'text/html');
  },

  /**
   * Exportar TODO (JSON + CSV + HTML en un ZIP simulado)
   * Nota: Requeriría librería como JSZip en producción
   */
  exportAll() {
    console.log('Exportando todos los formatos...');
    this.exportJSON();
    setTimeout(() => this.exportCSV(), 500);
    setTimeout(() => this.exportHTML(), 1000);
    console.log('✅ Exportación completada');
  },

  /**
   * Renderizar botones de exportación en HTML
   */
  renderExportButtons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return false;

    const html = `
      <div class="export-buttons">
        <button class="btn btn-export" onclick="exportManager.exportJSON()">
          📥 Descargar JSON
        </button>
        <button class="btn btn-export" onclick="exportManager.exportCSV()">
          📊 Descargar CSV
        </button>
        <button class="btn btn-export" onclick="exportManager.exportHTML()">
          📄 Ver Reporte HTML
        </button>
        <button class="btn btn-export btn-primary" onclick="exportManager.exportAll()">
          📦 Exportar Todo
        </button>
      </div>
    `;

    container.innerHTML = html;
    return true;
  }
};

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = exportManager;
}
