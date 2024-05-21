import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";


@Injectable({
    providedIn: 'root' // make it a globally avaialble singleton
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient, private loadingService: LoadingService, private messagesService: MessagesService) {
        this.loadAllCourses();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return null;
    }

    loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    console.log(message, err);
                    this.messagesService.showErrors(message);
                    return throwError(err);
                }
                ),
                tap(courses => this.subject.next(courses))
            );

        this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses =>
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo))
            );
    }

}