export interface NoShowPrediction {
  no_show_probability: number;
  risk_level: string;
  confidence_score: number;
  recommendation: string;
}

export interface WaitTimePrediction {
  estimated_wait_time: number;
  queue_position: number;
  estimated_service_start: string;
  confidence_score: number;
}

export interface PriorityClassification {
  priority_level: string;
  priority_score: number;
  urgency_factors: string[];
  recommendation: string;
}