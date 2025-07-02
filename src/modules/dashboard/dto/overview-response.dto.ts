export class OverviewResponseDto {
  totalFarms: number;
  totalHectares: number;
  byState: {
    state: string;
    total: number;
  }[];
  byCrop: {
    name: string;
    total: number;
  }[];
  landUse: {
    arableArea: number;
    vegetationArea: number;
  };
}
