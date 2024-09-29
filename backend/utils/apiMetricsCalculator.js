import { performance } from "perf_hooks";

class APIMetricsCalculator {
  constructor() {
    this.totalRequests = 0;
    this.concurrentRequests = 0;
    this.peakConcurrentRequests = 0;
    this.requestsPerEndpoint = {};
    this.averageResponseTime = 0;
    this.totalResponseTime = 0;
    this.trainingDataUploads = 0;
    this.totalTrainingDataSize = 0;
    this.contentGenerationRequests = 0;
    this.totalContentGenerationTime = 0;
    this.podcastProcessingRequests = 0;
    this.totalPodcastProcessingTime = 0;
    this.whatsAppMessages = 0;
    this.fineTuningJobs = 0;
    this.rateLimitHits = 0;
  }

  trackRequest(endpoint, duration) {
    this.totalRequests++;
    this.concurrentRequests++;
    this.peakConcurrentRequests = Math.max(
      this.peakConcurrentRequests,
      this.concurrentRequests
    );
    this.requestsPerEndpoint[endpoint] =
      (this.requestsPerEndpoint[endpoint] || 0) + 1;
    this.totalResponseTime += duration;
    this.averageResponseTime = this.totalResponseTime / this.totalRequests;
  }

  endRequest() {
    this.concurrentRequests--;
  }

  recordTrainingDataUpload(size) {
    this.trainingDataUploads++;
    this.totalTrainingDataSize += size;
  }

  recordContentGeneration(duration) {
    this.contentGenerationRequests++;
    this.totalContentGenerationTime += duration;
  }

  recordPodcastProcessing(duration) {
    this.podcastProcessingRequests++;
    this.totalPodcastProcessingTime += duration;
  }

  recordWhatsAppMessage() {
    this.whatsAppMessages++;
  }

  recordFineTuningJob() {
    this.fineTuningJobs++;
  }

  recordRateLimitHit() {
    this.rateLimitHits++;
  }

  getMetrics() {
    return {
      totalRequests: this.totalRequests,
      concurrentRequests: this.concurrentRequests,
      peakConcurrentRequests: this.peakConcurrentRequests,
      requestsPerEndpoint: this.requestsPerEndpoint,
      averageResponseTime: this.averageResponseTime,
      trainingDataUploads: this.trainingDataUploads,
      totalTrainingDataSize: this.totalTrainingDataSize,
      contentGenerationRequests: this.contentGenerationRequests,
      averageContentGenerationTime: this.contentGenerationRequests
        ? this.totalContentGenerationTime / this.contentGenerationRequests
        : 0,
      podcastProcessingRequests: this.podcastProcessingRequests,
      averagePodcastProcessingTime: this.podcastProcessingRequests
        ? this.totalPodcastProcessingTime / this.podcastProcessingRequests
        : 0,
      whatsAppMessages: this.whatsAppMessages,
      fineTuningJobs: this.fineTuningJobs,
      rateLimitHits: this.rateLimitHits,
    };
  }
}

export const metricsCalculator = new APIMetricsCalculator();

export const trackMetrics = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    metricsCalculator.trackRequest(req.path, duration);
  });
  res.on("close", () => {
    metricsCalculator.endRequest();
  });
  next();
};
