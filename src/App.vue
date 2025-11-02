<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🎥 Video Compressor</h1>
      <p class="subtitle">Compress your videos easily with a 3-compression limit per file</p>
    </header>
    <VideoCompressor />
  </div>
</template>

<script setup>
import VideoCompressor from './components/VideoCompressor.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
}
</style>

