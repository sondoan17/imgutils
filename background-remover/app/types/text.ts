export interface TextStyle {
  fontSize: number;
  color: string;
  opacity: number;
  fontFamily: string;
  fontWeight: string;
  shadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
  };
}

export const defaultTextStyle: TextStyle = {
  fontSize: 32,
  fontFamily: 'Roboto Mono',
  color: '#ffffff',
  opacity: 1,
  fontWeight: 'normal',
  shadow: {
    enabled: true,
    color: 'rgba(0, 0, 0, 0.5)',
    blur: 5,
    offsetX: 2,
    offsetY: 2
  },
  stroke: {
    enabled: false,
    color: '#ffffff',
    width: 2
  }
};
