export interface RecArea {
  RecAreaID: string;
  OrgRecAreaID: string;
  ParentOrgID: string;
  RecAreaName: string;
  RecAreaDescription: string;
  RecAreaFeeDescription: string;
  RecAreaDirections: string;
  RecAreaPhone: string;
  RecAreaEmail: string;
  RecAreaReservationURL: string;
  RecAreaMapURL: string;
  GEOJSON: {
    TYPE: string;
    COORDINATES: number[];
  };
  RecAreaLongitude: number;
  RecAreaLatitude: number;
  StayLimit: string;
  Keywords: string;
  Reservable: boolean;
  Enabled: boolean;
  LastUpdatedDate: string;
  ORGANIZATION: [
    {
      OrgID: string;
      OrgName: string;
      OrgImageURL: string;
      OrgURLText: string;
      OrgURLAddress: string;
      OrgType: string;
      OrgAbbrevName: string;
      OrgJurisdictionType: string;
      OrgParentID: string;
      LastUpdatedDate: string;
    }
  ];
  FACILITY: [
    {
      FacilityID: string;
      FacilityName: string;
      ResourceLink: string;
    }
  ];
  RECAREAADDRESS: [
    {
      RecAreaAddressID: string;
      RecAreaID: string;
      RecAreaAddressType: string;
      RecAreaStreetAddress1: string;
      RecAreaStreetAddress2: string;
      RecAreaStreetAddress3: string;
      City: string;
      PostalCode: string;
      AddressStateCode: string;
      AddressCountryCode: string;
      LastUpdatedDate: string;
    }
  ];
  ACTIVITY: [
    {
      ActivityID: string;
      ActivityParentID: string;
      RecAreaID: string;
      ActivityName: string;
      RecAreaActivityDescription: string;
      RecAreaActivityFeeDescription: string;
    }
  ];
  EVENT: [
    {
      EventID: string;
      EventName: string;
      ResourceLink: string;
    }
  ];
  MEDIA: [
    {
      EntityMediaID: string;
      MediaType: string;
      EntityID: string;
      EntityType: string;
      Title: string;
      Subtitle: string;
      Description: string;
      EmbedCode: string;
      Height: number;
      Width: number;
      IsPrimary: boolean;
      IsPreview: boolean;
      IsGallery: boolean;
      URL: string;
      Credits: string;
    }
  ];
  LINK: [
    {
      EntityLinkID: string;
      LinkType: string;
      EntityID: string;
      EntityType: string;
      Title: string;
      Description: string;
      URL: string;
    }
  ];
}

export interface RecAreaResponse {
  RECDATA: RecArea[];
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: number;
      TOTAL_COUNT: number;
    };
    PARAMETERS: {
      QUERY: string;
      LIMIT: number;
      OFFSET: number;
    };
  };
}

interface CampsitesResponse {
  RECDATA: [
    {
      CampsiteID: "string";
      FacilityID: "string";
      CampsiteName: "string";
      CampsiteType: "string";
      TypeOfUse: "string";
      Loop: "string";
      CampsiteAccessible: true;
      CampsiteLongitude: -118.0186111;
      CampsiteLatitude: 44.6969444;
      CreatedDate: "2018-10-01";
      LastUpdatedDate: "2018-10-01";
      ATTRIBUTES: [
        {
          AttributeID: 0;
          AttributeName: "string";
          AttributeValue: "string";
        }
      ];
      PERMITTEDEQUIPMENT: [
        {
          EquipmentName: "RV";
          MaxLength: 27;
        }
      ];
      ENTITYMEDIA: [
        {
          EntityMediaID: "string";
          MediaType: "Image";
          EntityID: "string";
          EntityType: "string";
          Title: "string";
          Subtitle: "string";
          Description: "string";
          EmbedCode: "string";
          Height: 0;
          Width: 0;
          IsPrimary: true;
          IsPreview: true;
          IsGallery: true;
          URL: "string";
          Credits: "string";
        }
      ];
    }
  ];
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: 1;
      TOTAL_COUNT: 2110;
    };
    PARAMETERS: {
      QUERY: "";
      LIMIT: 50;
      OFFSET: 0;
    };
  };
}

export interface ApiRequests {
  dateTime: number;
  availability: { [date: string]: { remaining: number; total: number } };
}