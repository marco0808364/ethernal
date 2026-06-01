<template>
  <div class="ai-analysis-container">
    <!-- AI Analysis Header -->
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-brain</v-icon>
        <span class="text-h6 font-weight-bold">AI Transaction Analysis</span>
        <v-spacer></v-spacer>
        <v-chip
          :color="analysisConfidence > 0.8 ? 'success' : analysisConfidence > 0.6 ? 'warning' : 'error'"
          text-color="white"
          size="small"
        >
          Confidence: {{ (analysisConfidence * 100).toFixed(1) }}%
        </v-chip>
      </v-card-title>
      <v-card-text>
        <p class="text-body-1 mb-4">
          Advanced AI-powered analysis of blockchain transactions using machine learning algorithms 
          to detect patterns, anomalies, and potential security threats.
        </p>
        
        <!-- Analysis Controls -->
        <div class="d-flex flex-wrap gap-2 mb-4">
          <v-btn
            color="primary"
            :loading="isAnalyzing"
            :disabled="!transaction || isAnalyzing"
            @click="startAnalysis"
          >
            <v-icon class="mr-2">mdi-magnify</v-icon>
            Start AI Analysis
          </v-btn>
          
          <v-btn
            variant="outlined"
            color="secondary"
            @click="clearAnalysis"
          >
            <v-icon class="mr-2">mdi-refresh</v-icon>
            Clear Results
          </v-btn>
          
          <v-btn
            variant="outlined"
            color="info"
            @click="exportAnalysis"
          >
            <v-icon class="mr-2">mdi-download</v-icon>
            Export Report
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Analysis Results -->
    <div v-if="analysisResults" class="analysis-results">
      <!-- Risk Assessment -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon :color="riskLevel.color" class="mr-2">mdi-shield-alert</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Risk Assessment</span>
        </v-card-title>
        <v-card-text>
          <div class="risk-meter mb-4">
            <v-progress-linear
              :value="riskLevel.value * 100"
              :color="riskLevel.color"
              height="8"
              rounded
            ></v-progress-linear>
            <div class="d-flex justify-between mt-2">
              <span class="text-caption">Low Risk</span>
              <span class="text-caption">High Risk</span>
            </div>
          </div>
          
          <div class="risk-details">
            <div class="d-flex align-center mb-2">
              <v-icon :color="riskLevel.color" class="mr-2" size="18">mdi-information</v-icon>
              <span class="text-body-2 font-medium">{{ riskLevel.label }}</span>
            </div>
            <p class="text-body-2 mb-0">{{ analysisResults.riskExplanation }}</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Pattern Detection -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="blue" class="mr-2">mdi-chart-line</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Detected Patterns</span>
        </v-card-title>
        <v-card-text>
          <div class="pattern-list">
            <div
              v-for="pattern in analysisResults.patterns"
              :key="pattern.type"
              class="pattern-item mb-3"
            >
              <div class="d-flex align-center mb-2">
                <v-icon :color="pattern.severity === 'high' ? 'red' : pattern.severity === 'medium' ? 'orange' : 'blue'" class="mr-2" size="18">
                  {{ pattern.icon }}
                </v-icon>
                <span class="text-body-2 font-medium">{{ pattern.name }}</span>
                <v-chip
                  :color="pattern.severity === 'high' ? 'error' : pattern.severity === 'medium' ? 'warning' : 'info'"
                  text-color="white"
                  size="x-small"
                  class="ml-2"
                >
                  {{ pattern.severity }}
                </v-chip>
              </div>
              <p class="text-body-2 mb-0 text-grey-darken-1">{{ pattern.description }}</p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Anomaly Detection -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="purple" class="mr-2">mdi-alert-circle</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Anomaly Detection</span>
        </v-card-title>
        <v-card-text>
          <div v-if="analysisResults.anomalies.length > 0" class="anomaly-list">
            <div
              v-for="anomaly in analysisResults.anomalies"
              :key="anomaly.id"
              class="anomaly-item mb-3"
            >
              <div class="d-flex align-center mb-2">
                <v-icon color="red" class="mr-2" size="18">mdi-alert</v-icon>
                <span class="text-body-2 font-medium">{{ anomaly.type }}</span>
                <v-spacer></v-spacer>
                <span class="text-caption text-grey">{{ anomaly.confidence }}% confidence</span>
              </div>
              <p class="text-body-2 mb-0 text-grey-darken-1">{{ anomaly.description }}</p>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <v-icon color="success" size="48" class="mb-2">mdi-check-circle</v-icon>
            <p class="text-body-1 text-grey-darken-1">No anomalies detected</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Predictive Insights -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="green" class="mr-2">mdi-lightbulb</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Predictive Insights</span>
        </v-card-title>
        <v-card-text>
          <div class="insights-list">
            <div
              v-for="insight in analysisResults.insights"
              :key="insight.id"
              class="insight-item mb-3"
            >
              <div class="d-flex align-center mb-2">
                <v-icon :color="insight.type === 'warning' ? 'orange' : insight.type === 'info' ? 'blue' : 'green'" class="mr-2" size="18">
                  {{ insight.type === 'warning' ? 'mdi-alert' : insight.type === 'info' ? 'mdi-information' : 'mdi-check' }}
                </v-icon>
                <span class="text-body-2 font-medium">{{ insight.title }}</span>
              </div>
              <p class="text-body-2 mb-0 text-grey-darken-1">{{ insight.description }}</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Loading State -->
    <div v-if="isAnalyzing" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        class="mb-4"
      ></v-progress-circular>
      <p class="text-body-1 text-grey-darken-1">Analyzing transaction with AI models...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!analysisResults && !isAnalyzing" class="text-center py-8">
      <v-icon color="grey" size="64" class="mb-4">mdi-brain</v-icon>
      <p class="text-body-1 text-grey-darken-1 mb-2">AI Transaction Analysis</p>
      <p class="text-body-2 text-grey-darken-2">Click "Start AI Analysis" to begin advanced transaction analysis</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const theme = useTheme()
const isAnalyzing = ref(false)
const analysisResults = ref(null)
const analysisConfidence = ref(0)

// Risk level calculation
const riskLevel = computed(() => {
  if (!analysisResults.value) return { value: 0, label: 'Unknown', color: 'grey' }
  
  const riskScore = analysisResults.value.riskScore || 0
  if (riskScore < 0.3) return { value: riskScore, label: 'Low Risk', color: 'green' }
  if (riskScore < 0.7) return { value: riskScore, label: 'Medium Risk', color: 'orange' }
  return { value: riskScore, label: 'High Risk', color: 'red' }
})

// Mock AI analysis function (would be replaced with actual ML model)
const startAnalysis = async () => {
  isAnalyzing.value = true
  analysisConfidence.value = 0
  
  try {
    // Simulate AI analysis with progressive confidence
    const confidenceInterval = setInterval(() => {
      analysisConfidence.value = Math.min(analysisConfidence.value + 0.1, 0.95)
    }, 500)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    clearInterval(confidenceInterval)
    
    // Generate mock analysis results
    analysisResults.value = {
      riskScore: Math.random() * 0.9 + 0.1,
      riskExplanation: 'This transaction shows moderate risk patterns based on AI analysis of historical transaction data and network behavior.',
      patterns: [
        {
          type: 'frequency',
          name: 'Unusual Transaction Frequency',
          description: 'Transaction frequency deviates from normal patterns for this address.',
          severity: 'medium',
          icon: 'mdi-clock-fast'
        },
        {
          type: 'amount',
          name: 'Large Value Transfer',
          description: 'Transaction value is significantly higher than typical for this address.',
          severity: 'low',
          icon: 'mdi-currency-usd'
        }
      ],
      anomalies: [
        {
          id: 1,
          type: 'Gas Price Spike',
          description: 'Unusually high gas price detected, potentially indicating MEV attack.',
          confidence: 87
        }
      ],
      insights: [
        {
          id: 1,
          type: 'warning',
          title: 'Potential MEV Attack',
          description: 'High gas price suggests possible MEV (Maximal Extractable Value) attack.'
        },
        {
          id: 2,
          type: 'info',
          title: 'Network Congestion',
          description: 'Current network conditions may impact transaction confirmation time.'
        }
      ]
    }
    
    analysisConfidence.value = 0.87
    
  } catch (error) {
    console.error('AI analysis failed:', error)
  } finally {
    isAnalyzing.value = false
  }
}

const clearAnalysis = () => {
  analysisResults.value = null
  analysisConfidence.value = 0
}

const exportAnalysis = () => {
  if (!analysisResults.value) return
  
  const report = {
    transaction: props.transaction,
    analysis: analysisResults.value,
    timestamp: new Date().toISOString(),
    confidence: analysisConfidence.value
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-analysis-${props.transaction.hash.substring(0, 8)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.ai-analysis-container {
  max-width: 100%;
}

.risk-meter {
  margin-bottom: 1rem;
}

.pattern-item,
.anomaly-item,
.insight-item {
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(var(--v-theme-primary-lighten1), 0.1);
}

.pattern-item {
  border-left: 4px solid var(--v-theme-primary);
}

.anomaly-item {
  border-left: 4px solid var(--v-theme-error);
}

.insight-item {
  border-left: 4px solid var(--v-theme-success);
}

.text-grey-darken-1 {
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.text-grey-darken-2 {
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>