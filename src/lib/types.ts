export type DataPoint = {
  time: number;
  temp: number;
  ph: number;
  turbidity: number;
  do: number;
};

export type Settings = {
  units: {
    temp: 'C' | 'F';
  };
  alerts: {
    temp: { min: number; max: number };
    ph: { min: number; max: number };
    turbidity: { max: number };
    do: { min: number };
  };
  refreshInterval: number;
};
