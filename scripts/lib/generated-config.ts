export interface GeneratedConfig {
  fileName: string;
  rules: Record<string, unknown>;
  source: string;
}

export type ConfigBuilder = () => GeneratedConfig[];
