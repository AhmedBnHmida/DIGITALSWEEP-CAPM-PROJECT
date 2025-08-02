using {myFinance} from '/home/user/projects/DigitalSweepIntern/db/schema.cds';

service Financeservice 
{

  // Draft-enabled entity for CRUD
  entity Finance @odata.draft.enabled as projection on myFinance.Finance;


  // Read-only projection for charts (no draft!)
  entity FinanceChart as projection on myFinance.Finance;
  

  entity MouthNumber as projection on myFinance.MouthNumber;
  entity Segments as projection on myFinance.Segments;


}