
export type IoEntity = {} & {
    id: number
}

export type IoDataTableName = 
  "CountyHealthData" 
  | "SubstanceAbuseData" 
  | "CourtData" 
  | "SocialServicesData"
  | "HonestBrokerData"
  | "HealthCareReport"
  | "SubstanceAbuseReport"

export type DomainTypes = {} & {
    domain: DomainValues
} 

export type DomainValues = 
    "CountyHealth" 
    | "SubstanceData" 
    | "CourtData" 
    | "SocialServices"
    | "HonestBroker"
    | "Researcher"
    | "HealthCare"


export type IoDatabaseCommand = {
    type: "IO_LOAD_DATA"
  } | {
    type: "IO_INSERT_PATIENT"
    item: IoEntity
  } | {
    type: "IO_DELETE_PATIENT"
    id: number
  } | {
    type: "IO_LOAD_BATCH"
    items: IoEntity[]
  }
  
export type IoDatabaseEvent = {
    type: "IO_DATA_LOADED"
    items: IoEntity[]
} | {
    type: "IO_PATIENT_INSERTED"
    item: IoEntity
} | {
    type: "IO_PATIENT_DELETED"
    id: number
} | {
    type: "IO_DATABASE_ERROR"
    error: any
}
  