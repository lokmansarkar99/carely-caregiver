export enum USER_ROLES {
    ADMIN = "ADMIN",
    CLIENT = "CLIENT",
    CAREGIVER = 'CAREGIVER'
}

export enum STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum GENDER {
  MALE              = 'male',
  FEMALE            = 'female',
  OTHER             = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum VERIFICATION_STATUS {
  UNVERIFIED = 'unverified', 
  PENDING    = 'pending',    
  VERIFIED   = 'verified',   
  REJECTED   = 'rejected',   
}