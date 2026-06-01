<template>
  <div class="advanced-security-analysis">
    <!-- Security Analysis Header -->
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="red">mdi-shield-lock</v-icon>
        <span class="text-h6 font-weight-bold">Advanced Security Analysis</span>
        <v-spacer></v-spacer>
        <v-chip
          :color="securityStatus.color"
          text-color="white"
          size="small"
        >
          {{ securityStatus.text }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <p class="text-body-1 mb-4">
          Comprehensive security analysis engine that detects sophisticated threats, 
          vulnerabilities, and attack patterns in blockchain transactions using 
          advanced algorithms and machine learning.
        </p>
        
        <!-- Security Metrics -->
        <div class="security-metrics d-flex flex-wrap gap-4 mb-4">
          <div class="metric-item">
            <div class="text-subtitle-2 text-grey-darken-1">Risk Score</div>
            <div class="text-h5 font-weight-bold" :class="riskScoreColor">{{ riskScore }}%</div>
          </div>
          <div class="metric-item">
            <div class="text-subtitle-2 text-grey-darken-1">Threats Detected</div>
            <div class="text-h5 font-weight-bold text-red">{{ threatsDetected }}</div>
          </div>
          <div class="metric-item">
            <div class="text-subtitle-2 text-grey-darken-1">Vulnerabilities</div>
            <div class="text-h5 font-weight-bold text-orange">{{ vulnerabilitiesFound }}</div>
          </div>
          <div class="metric-item">
            <div class="text-subtitle-2 text-grey-darken-1">Analysis Confidence</div>
            <div class="text-h5 font-weight-bold text-green">{{ confidence }}%</div>
          </div>
        </div>
        
        <!-- Analysis Controls -->
        <div class="d-flex flex-wrap gap-2">
          <v-btn
            color="red"
            :loading="isAnalyzing"
            :disabled="!transaction || isAnalyzing"
            @click="startAnalysis"
          >
            <v-icon class="mr-2">mdi-magnify-plus</v-icon>
            Start Security Analysis
          </v-btn>
          
          <v-btn
            variant="outlined"
            color="secondary"
            :disabled="!analysisResults"
            @click="exportReport"
          >
            <v-icon class="mr-2">mdi-download</v-icon>
            Export Report
          </v-btn>
          
          <v-btn
            variant="outlined"
            color="warning"
            @click="clearResults"
          >
            <v-icon class="mr-2">mdi-refresh</v-icon>
            Clear Results
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Analysis Results -->
    <div v-if="analysisResults" class="analysis-results">
      <!-- Threat Detection Summary -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="red" class="mr-2">mdi-alert</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Threat Detection Summary</span>
        </v-card-title>
        <v-card-text>
          <div class="threat-summary">
            <div class="d-flex align-center mb-3">
              <v-icon color="red" class="mr-2" size="18">mdi-alert-circle</v-icon>
              <span class="text-body-2 font-medium">Critical Threats</span>
              <v-spacer></v-spacer>
              <span class="text-caption text-grey">{{ criticalThreats }}</span>
            </div>
            
            <div class="d-flex align-center mb-3">
              <v-icon color="orange" class="mr-2" size="18">mdi-alert</v-icon>
              <span class="text-body-2 font-medium">High Threats</span>
              <v-spacer></v-spacer>
              <span class="text-caption text-grey">{{ highThreats }}</span>
            </div>
            
            <div class="d-flex align-center mb-3">
              <v-icon color="yellow" class="mr-2" size="18">mdi-alert-outline</v-icon>
              <span class="text-body-2 font-medium">Medium Threats</span>
              <v-spacer></v-spacer>
              <span class="text-caption text-grey">{{ mediumThreats }}</span>
            </div>
            
            <div class="d-flex align-center">
              <v-icon color="blue" class="mr-2" size="18">mdi-information</v-icon>
              <span class="text-body-2 font-medium">Low Threats</span>
              <v-spacer></v-spacer>
              <span class="text-caption text-grey">{{ lowThreats }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Detailed Threat Analysis -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="red" class="mr-2">mdi-security</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Detailed Threat Analysis</span>
        </v-card-title>
        <v-card-text>
          <div class="threat-list">
            <div
              v-for="threat in analysisResults.threats"
              :key="threat.type"
              class="threat-item mb-3"
              :class="threat.severity"
            >
              <div class="threat-header d-flex align-center mb-2">
                <v-icon :color="getThreatColor(threat.severity)" class="mr-2" size="18">
                  {{ getThreatIcon(threat.type) }}
                </v-icon>
                <span class="text-body-2 font-medium">{{ formatThreatType(threat.type) }}</span>
                <v-spacer></v-spacer>
                <v-chip
                  :color="getThreatColor(threat.severity)"
                  text-color="white"
                  size="x-small"
                  class="ml-2"
                >
                  {{ threat.severity }}
                </v-chip>
                <v-chip
                  color="info"
                  text-color="white"
                  size="x-small"
                  class="ml-1"
                >
                  {{ (threat.confidence * 100).toFixed(1) }}%
                </v-chip>
              </div>
              
              <div class="threat-description mb-2">
                <p class="text-body-2 mb-0">{{ threat.description }}</p>
              </div>
              
              <div class="threat-evidence mb-2">
                <div class="text-subtitle-2 text-grey-darken-1 mb-1">Evidence:</div>
                <ul class="text-body-2 mb-0">
                  <li v-for="evidence in threat.evidence" :key="evidence" class="mb-1">
                    • {{ evidence }}
                  </li>
                </ul>
              </div>
              
              <div class="threat-mitigation">
                <div class="text-subtitle-2 text-grey-darken-1 mb-1">Mitigation:</div>
                <p class="text-body-2 mb-0">{{ threat.mitigation }}</p>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Vulnerability Analysis -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="orange" class="mr-2">mdi-bug</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Vulnerability Analysis</span>
        </v-card-title>
        <v-card-text>
          <div v-if="analysisResults.vulnerabilities.length > 0" class="vulnerability-list">
            <div
              v-for="vulnerability in analysisResults.vulnerabilities"
              :key="vulnerability.type"
              class="vulnerability-item mb-3"
              :class="vulnerability.severity"
            >
              <div class="vulnerability-header d-flex align-center mb-2">
                <v-icon :color="getVulnerabilityColor(vulnerability.severity)" class="mr-2" size="18">
                  {{ getVulnerabilityIcon(vulnerability.type) }}
                </v-icon>
                <span class="text-body-2 font-medium">{{ formatVulnerabilityType(vulnerability.type) }}</span>
                <v-spacer></v-spacer>
                <v-chip
                  :color="getVulnerabilityColor(vulnerability.severity)"
                  text-color="white"
                  size="x-small"
                  class="ml-2"
                >
                  {{ vulnerability.severity }}
                </v-chip>
                <v-chip
                  color="info"
                  text-color="white"
                  size="x-small"
                  class="ml-1"
                >
                  {{ (vulnerability.confidence * 100).toFixed(1) }}%
                </v-chip>
              </div>
              
              <div class="vulnerability-description mb-2">
                <p class="text-body-2 mb-0">{{ vulnerability.description }}</p>
              </div>
              
              <div class="vulnerability-evidence mb-2">
                <div class="text-subtitle-2 text-grey-darken-1 mb-1">Evidence:</div>
                <ul class="text-body-2 mb-0">
                  <li v-for="evidence in vulnerability.evidence" :key="evidence" class="mb-1">
                    • {{ evidence }}
                  </li>
                </ul>
              </div>
              
              <div class="vulnerability-mitigation">
                <div class="text-subtitle-2 text-grey-darken-1 mb-1">Mitigation:</div>
                <p class="text-body-2 mb-0">{{ vulnerability.mitigation }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <v-icon color="success" size="48" class="mb-2">mdi-check-circle</v-icon>
            <p class="text-body-1 text-grey-darken-1">No vulnerabilities detected</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Recommendations -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="green" class="mr-2">mdi-lightbulb</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Security Recommendations</span>
        </v-card-title>
        <v-card-text>
          <div class="recommendations-list">
            <div
              v-for="recommendation in analysisResults.recommendations"
              :key="recommendation.timestamp"
              class="recommendation-item mb-3"
              :class="recommendation.priority"
            >
              <div class="recommendation-header d-flex align-center mb-2">
                <v-icon :color="getRecommendationColor(recommendation.priority)" class="mr-2" size="18">
                  {{ getRecommendationIcon(recommendation.priority) }}
                </v-icon>
                <span class="text-body-2 font-medium">{{ recommendation.action }}</span>
                <v-spacer></v-spacer>
                <v-chip
                  :color="getRecommendationColor(recommendation.priority)"
                  text-color="white"
                  size="x-small"
                  class="ml-2"
                >
                  {{ recommendation.priority }}
                </v-chip>
              </div>
              
              <div class="recommendation-reason">
                <p class="text-body-2 mb-0">{{ recommendation.reason }}</p>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Analysis Confidence -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="blue" class="mr-2">mdi-chart-line</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Analysis Confidence</span>
        </v-card-title>
        <v-card-text>
          <div class="confidence-meter">
            <div class="d-flex justify-between mb-2">
              <span class="text-body-2">Overall Confidence</span>
              <span class="text-body-2 font-medium">{{ confidence }}%</span>
            </div>
            <v-progress-linear
              :value="confidence / 100"
              :color="confidenceColor"
              height="8"
              rounded
            ></v-progress-linear>
            <div class="confidence-details mt-3">
              <p class="text-body-2 text-grey-darken-1 mb-0">
                Analysis confidence is based on the combination of pattern detection, 
                heuristic analysis, and machine learning algorithms. Higher confidence 
                indicates more reliable threat detection.
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Loading State -->
    <div v-if="isAnalyzing" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="red"
        size="64"
        class="mb-4"
      ></v-progress-circular>
      <p class="text-body-1 text-grey-darken-1">Performing advanced security analysis...</p>
      <p class="text-body-2 text-grey-darken-2">This may take several seconds for comprehensive analysis</p>
    </div>

    <!-- Empty State -->
    <div v-if="!analysisResults && !isAnalyzing" class="text-center py-8">
      <v-icon color="grey" size="64" class="mb-4">mdi-shield-lock</v-icon>
      <p class="text-body-1 text-grey-darken-1 mb-2">Advanced Security Analysis</p>
      <p class="text-body-2 text-grey-darken-2">Click "Start Security Analysis" to begin comprehensive threat detection</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SecurityAnalyzer } from '../lib/security-analyzer.js'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

// State management
const isAnalyzing = ref(false)
const analysisResults = ref(null)
const analysisTime = ref(0)

// Security analyzer instance
let securityAnalyzer = null

// Computed properties
const securityStatus = computed(() => {
  if (!analysisResults.value) return { color: 'grey', text: 'Not Analyzed' }
  if (analysisResults.value.riskScore > 0.8) return { color: 'red', text: 'Critical' }
  if (analysisResults.value.riskScore > 0.6) return { color: 'orange', text: 'High Risk' }
  if (analysisResults.value.riskScore > 0.3) return { color: 'yellow', text: 'Medium Risk' }
  return { color: 'green', text: 'Low Risk' }
})

const riskScore = computed(() => {
  if (!analysisResults.value) return 0
  return Math.round(analysisResults.value.riskScore * 100)
})

const riskScoreColor = computed(() => {
  if (riskScore.value > 80) return 'text-red'
  if (riskScore.value > 60) return 'text-orange'
  if (riskScore.value > 30) return 'text-yellow'
  return 'text-green'
})

const threatsDetected = computed(() => {
  if (!analysisResults.value) return 0
  return analysisResults.value.threats.length
})

const vulnerabilitiesFound = computed(() => {
  if (!analysisResults.value) return 0
  return analysisResults.value.vulnerabilities.length
})

const confidence = computed(() => {
  if (!analysisResults.value) return 0
  return Math.round(analysisResults.value.confidence * 100)
})

const confidenceColor = computed(() => {
  if (confidence.value > 80) return 'green'
  if (confidence.value > 60) return 'yellow'
  if (confidence.value > 40) return 'orange'
  return 'red'
})

const criticalThreats = computed(() => {
  if (!analysisResults.value) return 0
  return analysisResults.value.threats.filter(t => t.severity === 'critical').length
})

const highThreats = computed(() => {
  if (!analysisResults.value) return 0
  return analysisResults.value.threats.filter(t => t.severity === 'high').length
})

const mediumThreats = computed(() => {
  if (!analysisResults.value) return 0
  return analysisResults.value.threats.filter(t => t.severity === 'medium').length
})

const lowThreats = computed(() => {
  if (!analysisResults.value) return 0
  return analysisResults.value.threats.filter(t => t.severity === 'low').length
})

// Methods
const startAnalysis = async () => {
  if (isAnalyzing.value) return
  
  isAnalyzing.value = true
  analysisResults.value = null
  
  try {
    // Initialize security analyzer
    securityAnalyzer = new SecurityAnalyzer({
      scanningDepth: 'deep',
      enableML: true,
      enableRealTime: true,
      maxTransactionSize: 1000000
    })
    
    // Prepare context for analysis
    const context = {
      averageGasPrice: 20000000000,
      addressInfo: {
        isNew: false,
        isKnown: true
      },
      mempoolTime: Date.now() - 5000,
      transactionHistory: [],
      threatIntelligence: {}
    }
    
    // Perform analysis
    const startTime = performance.now()
    const results = await securityAnalyzer.analyzeTransaction(props.transaction, context)
    const endTime = performance.now()
    
    analysisResults.value = results
    analysisTime.value = endTime - startTime
    
  } catch (error) {
    console.error('Security analysis failed:', error)
  } finally {
    isAnalyzing.value = false
  }
}

const exportReport = () => {
  if (!analysisResults.value) return
  
  const report = {
    transaction: props.transaction,
    analysis: analysisResults.value,
    timestamp: new Date().toISOString(),
    analysisTime: analysisTime.value,
    securityMetrics: {
      riskScore: riskScore.value,
      confidence: confidence.value,
      threatsDetected: threatsDetected.value,
      vulnerabilitiesFound: vulnerabilitiesFound.value
    }
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `security-analysis-${props.transaction.hash.substring(0, 8)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearResults = () => {
  analysisResults.value = null
  analysisTime.value = 0
}

// Helper methods
const getThreatColor = (severity) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue'
  }
  return colors[severity] || 'grey'
}

const getThreatIcon = (type) => {
  const icons = {
    reentrancy: 'mdi-sync-alert',
    'front-running': 'mdi-run-fast',
    'flash-loan': 'mdi-bolt',
    'sandwich-attack': 'mdi-food-variant',
    'dust-attack': 'mdi-grain',
    phishing: 'mdi-phish',
    'unusual-gas-price': 'mdi-gas-station',
    'large-value-from-new-address': 'mdi-account-alert'
  }
  return icons[type] || 'mdi-alert'
}

const formatThreatType = (type) => {
  return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getVulnerabilityColor = (severity) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue'
  }
  return colors[severity] || 'grey'
}

const getVulnerabilityIcon = (type) => {
  const icons = {
    'reentrancy-vulnerability': 'mdi-sync-alert',
    'integer-overflow-vulnerability': 'mdi-calculator',
    'erc20-approval-vulnerability': 'mdi-approval',
    'access-control-vulnerability': 'mdi-lock'
  }
  return icons[type] || 'mdi-bug'
}

const formatVulnerabilityType = (type) => {
  return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getRecommendationColor = (priority) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue'
  }
  return colors[priority] || 'grey'
}

const getRecommendationIcon = (priority) => {
  const icons = {
    critical: 'mdi-alert-circle',
    high: 'mdi-alert',
    medium: 'mdi-alert-outline',
    low: 'mdi-information'
  }
  return icons[priority] || 'mdi-lightbulb'
}

// Lifecycle hooks
onMounted(() => {
  // Initialize security analyzer
  securityAnalyzer = new SecurityAnalyzer({
    scanningDepth: 'deep',
    enableML: true,
    enableRealTime: true,
    maxTransactionSize: 1000000
  })
})
</script>

<style scoped>
.advanced-security-analysis {
  max-width: 100%;
}

.security-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background-color: rgba(var(--v-theme-primary-lighten1), 0.1);
  border-radius: 0.5rem;
}

.threat-item,
.vulnerability-item,
.recommendation-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: rgba(var(--v-theme-background), 0.5);
}

.threat-item.critical {
  border-left: 4px solid var(--v-theme-error);
}

.threat-item.high {
  border-left: 4px solid var(--v-theme-warning);
}

.threat-item.medium {
  border-left: 4px solid var(--v-theme-secondary);
}

.threat-item.low {
  border-left: 4px solid var(--v-theme-info);
}

.vulnerability-item.critical {
  border-left: 4px solid var(--v-theme-error);
}

.vulnerability-item.high {
  border-left: 4px solid var(--v-theme-warning);
}

.vulnerability-item.medium {
  border-left: 4px solid var(--v-theme-secondary);
}

.vulnerability-item.low {
  border-left: 4px solid var(--v-theme-info);
}

.recommendation-item.critical {
  border-left: 4px solid var(--v-theme-error);
}

.recommendation-item.high {
  border-left: 4px solid var(--v-theme-warning);
}

.recommendation-item.medium {
  border-left: 4px solid var(--v-theme-secondary);
}

.recommendation-item.low {
  border-left: 4px solid var(--v-theme-info);
}

.threat-header,
.vulnerability-header,
.recommendation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.threat-description,
.vulnerability-description,
.recommendation-reason {
  margin-left: 2rem;
}

.threat-evidence,
.vulnerability-evidence,
.threat-mitigation,
.vulnerability-mitigation {
  margin-left: 2rem;
}

.confidence-meter {
  padding: 1rem;
  background-color: rgba(var(--v-theme-primary-lighten1), 0.1);
  border-radius: 0.5rem;
}

.text-grey-darken-1 {
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.text-grey-darken-2 {
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>