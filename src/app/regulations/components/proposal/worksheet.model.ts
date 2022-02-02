export class Worksheet {
  id: number;
  title: string;
  parentId: number;
  children: Worksheet[];
  isActive: boolean;
  stepOrder: number;
}
