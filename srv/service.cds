using {myFinance} from '/home/user/projects/DigitalSweepIntern/db/schema.cds';

service Financeservice 
{
  entity Finance as projection on myFinance.Finance;
  entity MouthNumber as projection on myFinance.MouthNumber

}