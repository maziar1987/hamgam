

export interface Person {
  id: number;
  lastName: string;
  firstName: string;
}
export interface PersonExtended extends Person {
  fullName: string;
}

export class Person_ {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  birthDate: string;
  nationalCode: string;
  employmentDate: Date;
  rankId: number;
  educationDegreeId: number;
  studyFieldId: number;
  personnelCode: string;
  organizationId: number;
  organizationName: string;
}

export class SearchPerson {
  value: string;
}