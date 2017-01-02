import {Observable, ReplaySubject} from "rxjs";

export class Entity {
  id?: number;
}

class ObservableEntityList<T extends Entity> {

  private entitiesSubj = new ReplaySubject<T[]>(1);
  private entities = new Map<number, T>();

  private pushEntityList() {
    let entityLIst = Array.from(this.entities.values());
    this.entitiesSubj.next(entityLIst);
  }

  constructor(observables: Observable<T>[]) {
    if (observables.length) {
      observables.forEach(observable => {
        let entityId: number;
        let isInitialised = false;
        observable.subscribe(
          entity => {
            if (isInitialised) {
              this.entities.set(entity.id, entity);
              this.pushEntityList();
            } else {
              isInitialised = true;
              entityId = entity.id;
              this.entities.set(entity.id, entity);
              if (this.entities.size === observables.length) {
                this.pushEntityList();
              }
            }
          },
          () => {
          },
          () => {
            this.entities.delete(entityId);
            this.pushEntityList();
          }
        );
      });
    } else {
      this.entitiesSubj.next([]);
    }
  }

  getEntities(): Observable<T[]> {
    return this.entitiesSubj;
  }

}

export class EntityUtils {
  static mergeObservables<T extends Entity>(observables: Observable<T>[]): Observable<T[]> {
    let list = new ObservableEntityList(observables);
    return list.getEntities();
  }
}
