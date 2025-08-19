using { myFinance } from '/home/user/projects/DigitalSweepIntern/db/schema.cds';

@odata.type: 'complex'
type ExchangeRateResponse {
  value : Decimal;
}

/*
type TemperatureReading {
  dateTime: String;
  temperature: Decimal(10,2);
}

type WeatherResponse {
  temperatures: array of TemperatureReading;
  description: String;
}
*/


service Financeservice {

  // Entity for custom app
  entity Finances as projection on myFinance.Finance;

  // Custom action to call an API
  action getExchangeRate(base: String, target: String) returns ExchangeRateResponse;

  // New action for weather
  //action getWeather(lat: Decimal, lon: Decimal) returns WeatherResponse;


  // Draft-enabled entity for CRUD
  entity Finance @odata.draft.enabled as projection on myFinance.Finance;

  // Read-only projection for charts
  entity FinanceChart as projection on myFinance.Finance;

  entity MouthNumber as projection on myFinance.MouthNumber;
  entity Segments as projection on myFinance.Segments;
}
