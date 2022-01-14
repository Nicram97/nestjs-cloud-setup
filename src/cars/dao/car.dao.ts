export class Car {
  name: string;
  miles_per_gallon: number;
  cylinders: number;
  displacement: number;
  horsepower: number;
  weight_in_lbs: number;
  acceleration: number;
  year: string;
  origin: string;

  constructor(object: any) {
    this.name = object.Name;
    this.miles_per_gallon = object.Miles_per_Gallon;
    this.cylinders = object.Cylinders;
    this.displacement = object.Displacement;
    this.horsepower = object.Horsepower;
    this.weight_in_lbs = object.Weight_in_lbs;
    this.acceleration = object.Acceleration;
    this.year = object.Year;
    this.origin = object.Origin;
  }
}
