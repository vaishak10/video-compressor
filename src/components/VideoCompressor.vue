<template>
  <div class="compressor-container">
    <!-- Upload Section -->
    <div class="upload-section" v-if="!selectedFile">
      <div 
        class="drop-zone"
        @drop.prevent="handleDrop"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        :class="{ 'drag-over': dragOver }"
      >
        <input 
          type="file" 
          ref="fileInput"
          @change="handleFileSelect"
          accept="video/*"
          style="display: none"
        />
        <div class="drop-zone-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="17 8 12 3 7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Drop your video here</h3>
          <p>or</p>
          <button @click="$refs.fileInput.click()" class="browse-btn">Browse Files</button>
          <p class="file-info">Supported formats: MP4, WebM, AVI, MOV</p>
        </div>
      </div>
    </div>

    <!-- Video Processing Section -->
    <div class="processing-section" v-else>
      <div class="file-info-card">
        <h3>📁 {{ selectedFile.name }}</h3>
        <p>Size: {{ formatFileSize(selectedFile.size) }}</p>
        <p>Compressions used: {{ compressionCount }} / 3</p>
        <button @click="resetFile" class="secondary-btn">Choose Different File</button>
      </div>

      <!-- Compression Controls -->
      <div class="compression-controls">
        <h3>Compression Settings</h3>
        <div class="quality-control">
          <label>Quality: {{ quality }}%</label>
          <input 
            type="range" 
            v-model="quality" 
            min="10" 
            max="100" 
            step="10"
            :disabled="isCompressing"
          />
          <div class="quality-labels">
            <span>Lower size</span>
            <span>Better quality</span>
          </div>
        </div>
        
        <button 
          @click="compressVideo" 
          :disabled="isCompressing || compressionCount >= 3"
          class="compress-btn"
        >
          {{ isCompressing ? 'Compressing...' : 'Compress Video' }}
        </button>

        <div v-if="compressionProgress > 0 && isCompressing" class="progress-bar">
          <div class="progress-fill" :style="{ width: compressionProgress + '%' }"></div>
          <span class="progress-text">{{ compressionProgress }}%</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="compressionCount >= 3" class="error-message">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div>
          <strong>Compression Limit Reached</strong>
          <p>You have reached the maximum of 3 compressions for this file. Please select a different file to continue.</p>
        </div>
      </div>

      <!-- Video Preview and Download -->
      <div v-if="compressedVideoUrl" class="result-section">
        <h3>✅ Compression Complete!</h3>
        <div class="video-comparison">
          <div class="video-box">
            <h4>Original Video</h4>
            <video :src="originalVideoUrl" controls></video>
            <p>Size: {{ formatFileSize(selectedFile.size) }}</p>
          </div>
          <div class="video-box">
            <h4>Compressed Video</h4>
            <video :src="compressedVideoUrl" controls></video>
            <p v-if="compressedSize">Size: {{ formatFileSize(compressedSize) }}</p>
            <p class="savings" v-if="compressionRatio">
              Saved {{ compressionRatio }}%
            </p>
          </div>
        </div>
        <button @click="downloadCompressed" class="download-btn">
          Download Compressed Video
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedFile = ref(null)
const fileInput = ref(null)
const dragOver = ref(false)
const compressionCount = ref(0)
const quality = ref(50)
const isCompressing = ref(false)
const compressionProgress = ref(0)
const originalVideoUrl = ref(null)
const compressedVideoUrl = ref(null)
const compressedSize = ref(0)
const fileCompressionMap = ref(new Map())

const compressionRatio = computed(() => {
  if (!selectedFile.value || !compressedSize.value) return 0
  const saved = ((selectedFile.value.size - compressedSize.value) / selectedFile.value.size) * 100
  return Math.round(saved)
})

const handleDrop = (e) => {
  dragOver.value = false
  const files = e.dataTransfer.files
  if (files.length > 0 && files[0].type.startsWith('video/')) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  selectedFile.value = file
  originalVideoUrl.value = URL.createObjectURL(file)
  
  // Check if this file has been compressed before
  const fileKey = `${file.name}-${file.size}`
  if (fileCompressionMap.value.has(fileKey)) {
    compressionCount.value = fileCompressionMap.value.get(fileKey)
  } else {
    compressionCount.value = 0
    fileCompressionMap.value.set(fileKey, 0)
  }
  
  // Clear previous compression
  compressedVideoUrl.value = null
  compressedSize.value = 0
}

const compressVideo = async () => {
  if (compressionCount.value >= 3) return
  
  isCompressing.value = true
  compressionProgress.value = 0
  
  try {
    // Simulate compression progress
    const progressInterval = setInterval(() => {
      if (compressionProgress.value < 90) {
        compressionProgress.value += 10
      }
    }, 200)
    
    // Create a canvas to process the video
    const video = document.createElement('video')
    video.src = originalVideoUrl.value
    
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve
    })
    
    video.currentTime = 0
    await new Promise((resolve) => {
      video.onseeked = resolve
    })
    
    // Use MediaRecorder API to compress the video
    const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream()
    
    // Calculate bitrate based on quality
    const videoBitrate = Math.floor((quality.value / 100) * 2500000)
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: videoBitrate
    })
    
    const chunks = []
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }
    
    mediaRecorder.onstop = () => {
      clearInterval(progressInterval)
      compressionProgress.value = 100
      
      const blob = new Blob(chunks, { type: 'video/webm' })
      compressedVideoUrl.value = URL.createObjectURL(blob)
      compressedSize.value = blob.size
      
      // Update compression count
      const fileKey = `${selectedFile.value.name}-${selectedFile.value.size}`
      compressionCount.value++
      fileCompressionMap.value.set(fileKey, compressionCount.value)
      
      isCompressing.value = false
    }
    
    mediaRecorder.start()
    video.play()
    
    // Stop recording after video duration
    setTimeout(() => {
      video.pause()
      mediaRecorder.stop()
    }, video.duration * 1000 || 3000)
    
  } catch (error) {
    console.error('Compression error:', error)
    isCompressing.value = false
    alert('Error compressing video. Please try a different file or browser.')
  }
}

const downloadCompressed = () => {
  if (!compressedVideoUrl.value) return
  
  const a = document.createElement('a')
  a.href = compressedVideoUrl.value
  a.download = `compressed-${selectedFile.value.name.replace(/\.[^/.]+$/, '')}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const resetFile = () => {
  selectedFile.value = null
  originalVideoUrl.value = null
  compressedVideoUrl.value = null
  compressedSize.value = 0
  compressionProgress.value = 0
  isCompressing.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
.compressor-container {
  max-width: 1000px;
  margin: 0 auto;
}

.upload-section {
  padding: 2rem 0;
}

.drop-zone {
  border: 3px dashed #667eea;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
}

.drop-zone.drag-over {
  background: rgba(102, 126, 234, 0.15);
  border-color: #764ba2;
  transform: scale(1.02);
}

.drop-zone-content svg {
  opacity: 0.6;
  margin-bottom: 1rem;
}

.drop-zone-content h3 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.drop-zone-content p {
  margin: 0.5rem 0;
  opacity: 0.7;
}

.browse-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  margin: 1rem 0;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.file-info {
  font-size: 0.85rem;
  opacity: 0.6;
}

.processing-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.file-info-card {
  background: rgba(102, 126, 234, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.file-info-card h3 {
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.file-info-card p {
  margin: 0.25rem 0;
  opacity: 0.8;
}

.secondary-btn {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
}

.compression-controls {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
}

.compression-controls h3 {
  margin-bottom: 1.5rem;
}

.quality-control {
  margin-bottom: 2rem;
}

.quality-control label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quality-control input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

.quality-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
}

.quality-control input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
}

.quality-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.compress-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.compress-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.progress-bar {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 40px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 8px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  z-index: 1;
}

.error-message {
  background: rgba(255, 82, 82, 0.1);
  border: 2px solid rgba(255, 82, 82, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  color: #ff5252;
}

.error-message svg {
  flex-shrink: 0;
  stroke: #ff5252;
}

.error-message strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.error-message p {
  margin: 0;
  opacity: 0.9;
}

.result-section {
  background: rgba(102, 234, 147, 0.1);
  padding: 2rem;
  border-radius: 12px;
}

.result-section h3 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.video-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.video-box {
  text-align: center;
}

.video-box h4 {
  margin-bottom: 1rem;
}

.video-box video {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: #000;
}

.video-box p {
  margin: 0.25rem 0;
  opacity: 0.8;
}

.savings {
  color: #4caf50;
  font-weight: 600;
  font-size: 1.1rem;
}

.download-btn {
  width: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

@media (max-width: 768px) {
  .drop-zone {
    padding: 2rem 1rem;
  }
  
  .video-comparison {
    grid-template-columns: 1fr;
  }
  
  .compression-controls {
    padding: 1.5rem;
  }
}
</style>

