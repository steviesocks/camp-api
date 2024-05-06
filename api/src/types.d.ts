// response body from `https://www.recreation.gov/api/permititinerary/${PERMIT_ITINERARY}/division/${site.division}/availability/${DATE_RANGE}`
export interface AvailabilityResponse {
  //dates are YYYY-MM-DD
  payload: {
    bools: {
      [date: string]: boolean;
    };
    quota_type_maps: {
      QuotaUsageBySiteDaily: {
        [date: string]: {
          total: number;
          remaining: number;
          show_walkup: boolean;
          is_hidden: boolean;
          season_type: string;
        };
      };
    };
    rules: {
      permit_id: string;
      division_id: string;
      name: string;
      type: number;
      operation: string;
      target: string;
      value: number;
      metadata: string;
      account_type: number;
      version: number;
      inactive: false;
      modified_by: string;
      modified_time: string;
      created_time: string;
      item_id: string;
      id: string;
      start_date: string;
      end_date: string;
      management_year_id: string;
    }[];
  };
}

export interface ApiRequests {
  dateTime: number;
  availability: { [date: string]: { remaining: number; total: number } };
}

interface RequestsHistoryRepsonse {
  [key: string]: {
    dateTime: number;
    filteredDates: [
      string,
      {
        total: number;
        remaining: number;
        show_walkup: boolean;
        is_hidden: boolean;
        season_type: string;
      }
    ][];
  };
}

interface Campsite {
  shortName: string;
  name: string;
  dates: string[];
  division: number;
}
