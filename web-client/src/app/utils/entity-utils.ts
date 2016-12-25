import {BehaviorSubject, Observable} from "rxjs";

export class Entity {
  id?: number;
}

class ObservableEntityList<T extends Entity> {

  private entitiesSubj: BehaviorSubject<T[]>;
  private entities = new Map<number, T>();

  private generateEntityList() {
    return Array.from(this.entities.values());
  }

  constructor(observables: Observable<T>[]) {
    if (observables.length) {
      observables.forEach(observable => {
        let isInitialised = false;
        observable.subscribe(entity => {
          if (isInitialised) {
            this.entities.set(entity.id, entity);
            this.entitiesSubj.next(this.generateEntityList());
          } else {
            isInitialised = true;
            this.entities.set(entity.id, entity);
            if (this.entities.size === observables.length) {
              this.entitiesSubj = new BehaviorSubject<T[]>(this.generateEntityList());
            }
          }
        });
      });
    } else {
      this.entitiesSubj = new BehaviorSubject<T[]>([]);
    }
  }

  getEntities(): Observable<T[]> {
    return this.entitiesSubj;
  }

}

export class EntityUtils {
  static mergeObservables<T extends Entity>(observables: Observable<T>[]) : Observable<T[]> {
    let list = new ObservableEntityList(observables);
    return list.getEntities();
  }
}
