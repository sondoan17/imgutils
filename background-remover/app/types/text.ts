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
  fontSize: 48,
  color: '#000000',
  opacity: 1,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  shadow: {
    enabled: false,
    color: '#000000',
    blur: 4,
    offsetX: 2,
    offsetY: 2
  },
  stroke: {
    enabled: false,
    color: '#ffffff',
    width: 2
  }
};
