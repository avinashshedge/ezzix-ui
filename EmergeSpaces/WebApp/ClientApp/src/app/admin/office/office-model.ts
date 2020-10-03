export class Office {
  constructor(      
      public officeName: string,
      public companyId: number,
      public address: string,
      public countryId: number,
      public stateId: number,
      public city: string,
      public zipCode: string,
      public phoneNo: number,
      public fax: string
  ) { }
}
