var gulp = require('gulp');
var del = require('del');
var inject = require('gulp-inject');
var browserSync = require('browser-sync');

var concat = require('gulp-concat');

var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');

var ngAnnotate = require('gulp-ng-annotate');
var jshint = require('gulp-jshint');
var sourceMaps = require('gulp-sourcemaps');

var karma = require('gulp-karma');

//=========================================== configs ===========================================

var srcFolder = '../src/main';
//var testsFolder = '..src/test';
var devTargetFolder = '../../public';
var devImagesFolder = devTargetFolder + '/images';
var devFontsFolder = devTargetFolder + '/fonts';
var devLibFolder = devTargetFolder + '/lib';

var config = {
    indexSource: srcFolder + '/index.html',
    imagesSource: srcFolder + '/images/**/*',
    htmlSource: [
        srcFolder + '/**/*.html'
    ],
    jsSource: [
        srcFolder + '/app.js',
        srcFolder + '/interceptors/**/*.js',
        srcFolder + '/config/**/*.js',
        srcFolder + '/filters/**/*.js',
        srcFolder + '/injectables/**/*.js',
        srcFolder + '/components/**/*.js',
        srcFolder + '/pages/**/*.js'
    ],
    lessSource: [
        srcFolder + '/**/*.less'
        //],
        //bowerJsForTest: [
        //    'bower_components/angular-mocks/angular-mocks.js'
        //],
        //jsTestSource: [
        //    testsFolder + '/**/*.js'
    ]
};

var devConfig = {
    npmLibJs: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        // 'node_modules/angular-file-upload/dist/angular-file-upload.js',
        'node_modules/buckets-js/dist/buckets.js',
        // 'node_modules/angular-auto-validate/dist/jcs-auto-validate.js',
        // 'node_modules/angular-auto-validate/dist/lang/jcs-auto-validate_ru-ru.json',
        // 'node_modules/ng-table/dist/ng-table.js',
        // 'node_modules/moment/min/moment.min.js',
        'node_modules/angularjs-toaster/toaster.js'
    ],
    npmLibCss: [
        // 'node_modules/bootstrap/dist/css/bootstrap.css',
        // 'node_modules/ng-table/dist/ng-table.css',
        'node_modules/angularjs-toaster/toaster.css'
    ],
    npmLibFonts: [
        // 'node_modules/bootstrap/fonts/*'
    ],
    libJs: [
        devLibFolder + '/jquery.js',
        devLibFolder + '/angular.js',
        devLibFolder + '/angular-ui-router.js',
        devLibFolder + '/**/*.js'
    ],
    libCss: [
        devLibFolder + '/**/*.css'
    ]
};

//=========================================== helpers ===========================================

function copy(srcMask, destFolder) {
    return gulp.src(srcMask).pipe(gulp.dest(destFolder))
}

function npm2lib(npmSources, libFolder) {
    del.sync(libFolder);
    return copy(npmSources, libFolder);
}

function fillIndex(indexSource, sourcesToFill, indexFinalDestination) {
    var gulpedSources = gulp.src(sourcesToFill, {read: false});

    return gulp.src(indexSource)
        .pipe(gulp.dest(indexFinalDestination))
        .pipe(inject(gulpedSources, {relative: true}))
        .pipe(gulp.dest(indexFinalDestination));
}

//==================================== developer environment ====================================

gulp.task('clean', function(callback) {
    return del(devTargetFolder, {force: true}, callback);
});

gulp.task('npm2pack', function() {
    var npmSources = devConfig.npmLibJs.concat(devConfig.npmLibCss);
    return npm2lib(npmSources, devLibFolder);
});

gulp.task('images2pack', function() {
    return copy(config.imagesSource, devImagesFolder)
});

gulp.task('fonts2pack', function() {
    return copy(devConfig.npmLibFonts, devFontsFolder)
});

gulp.task('js2pack', function() {
    return gulp.src(config.jsSource)
        .pipe(sourceMaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        //.pipe(uglify())
        .pipe(sourceMaps.write('js-maps'))
        .pipe(gulp.dest(devTargetFolder))
});

gulp.task('less2pack', function() {
    return gulp.src(config.lessSource)
        .pipe(sourceMaps.init())
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(minifyCSS())
        .pipe(sourceMaps.write('css-maps'))
        .pipe(gulp.dest(devTargetFolder))
});

gulp.task('html2pack', function() {
    return gulp.src(config.htmlSource)
        .pipe(minifyHTML())
        .pipe(gulp.dest(devTargetFolder));
});

gulp.task('index2pack', function() {
    var addToIndexSources =
        devConfig.libJs
            .concat(devConfig.libCss)
            .concat(devTargetFolder + '/app.js')
            .concat(devTargetFolder + '/app.css');

    return fillIndex(config.indexSource, addToIndexSources, devTargetFolder)
        .pipe(minifyHTML())
        .pipe(gulp.dest(devTargetFolder));
});

gulp.task('browserSync.start', function() {
    browserSync({
        server: {
            baseDir: devTargetFolder
        },
        port: 9090,
        https: false,
        ui: {
            port: 9091
        },
        notify: false,
        ghostMode: false,
        browser: 'google-chrome-stable'
        //browser: 'firefox'
    });
});


gulp.task('watch', function() {
    // Organize synchronizing browserSync restarts (if js and less files changed simultaneously)
    var locks = {};

    function getLockTask(lockName) {
        return function(callback) {
            locks[lockName] = true;
            callback();
        }
    }

    function getUnLockTask(lockName) {
        return function(callback) {
            locks[lockName] = false;
            callback();
        }
    }

    gulp.task('browserSync.reloadAfterUnlocks', function(callback) {
        function isLocked() {
            for (key in Object.keys(locks)) {
                if (locks[key]) return true;
            }
            return false;
        }

        if (!isLocked()) browserSync.reload();
        callback();
    });

    // update npm
    var npmSources = devConfig.npmLibJs.concat(devConfig.npmLibCss);
    gulp.watch(npmSources, gulp.series(getLockTask('npm2pack'), 'npm2pack', getUnLockTask('npm2pack'), 'browserSync.reloadAfterUnlocks'));

    // update js
    gulp.watch(config.jsSource, gulp.series(getLockTask('js2pack'), 'js2pack', getUnLockTask('js2pack'), 'browserSync.reloadAfterUnlocks'));

    // update less
    gulp.watch(config.lessSource, gulp.series(getLockTask('less2pack'), 'less2pack', getUnLockTask('less2pack'), 'browserSync.reloadAfterUnlocks'));

    // update html
    gulp.watch(config.htmlSource, gulp.series(getLockTask('html2pack'), 'html2pack', 'index2pack', getUnLockTask('html2pack'), 'browserSync.reloadAfterUnlocks'));
});

gulp.task('dev', gulp.series(
    'clean',
    gulp.parallel('images2pack', 
        // 'fonts2pack', 
        'npm2pack', 'js2pack', 'less2pack', 'html2pack'),
    'index2pack',
    gulp.parallel('browserSync.start', 'watch')
));