// Progress tracking con localStorage

const STORAGE_KEY = 'claude-mastery-progress'

export const ProgressTracker = {
  // Obtener progreso actual
  getProgress: () => {
    if (typeof window === 'undefined') return {}
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {
      completedSections: [],
      completedChallenges: [],
      currentSection: 'dashboard',
      startDate: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      totalTimeMinutes: 0,
    }
  },

  // Guardar sección completada
  completeSection: (sectionId) => {
    if (typeof window === 'undefined') return
    const progress = ProgressTracker.getProgress()
    if (!progress.completedSections.includes(sectionId)) {
      progress.completedSections.push(sectionId)
    }
    progress.lastAccess = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  },

  // Guardar desafío completado
  completeChallenge: (challengeId) => {
    if (typeof window === 'undefined') return
    const progress = ProgressTracker.getProgress()
    if (!progress.completedChallenges.includes(challengeId)) {
      progress.completedChallenges.push(challengeId)
    }
    progress.lastAccess = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  },

  // Actualizar sección actual
  setCurrentSection: (sectionId) => {
    if (typeof window === 'undefined') return
    const progress = ProgressTracker.getProgress()
    progress.currentSection = sectionId
    progress.lastAccess = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  },

  // Calcular porcentaje completado
  getCompletionPercentage: () => {
    const progress = ProgressTracker.getProgress()
    const totalSections = 35 // Número de secciones
    return Math.round((progress.completedSections.length / totalSections) * 100)
  },

  // Limpiar progreso
  resetProgress: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  },

  // Agregar tiempo de sesión
  addSessionTime: (minutes) => {
    if (typeof window === 'undefined') return
    const progress = ProgressTracker.getProgress()
    progress.totalTimeMinutes += minutes
    progress.lastAccess = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }
}
