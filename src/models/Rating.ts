import { decorate, observable } from "mobx";

class Rating {
    public outcomeScore?: number;
    public processScore?: number;
    public labels: string[] = [];
    public notes?: string;
    public remindOnDate?: string; // TODO make date?
    public remindOnState?: string;
  }

  decorate(Rating, {
    outcomeScore: observable,
    processScore: observable,
    labels: observable,
    notes: observable,
    remindOnDate: observable,
    remindOnState: observable
  });
  export default Rating;