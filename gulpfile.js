// SPDX-License-Identifier: MIT

'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const cached = require('gulp-cached');
const vsce = require('vsce');

const extension = ts.createProject('tsconfig.json');
const webview = ts.createProject('./resources/tsconfig.json');

const rootDir = extension.options.rootDir;
const outDir = extension.options.outDir;

// 拷贝 testdata 目录下的内容
function copy() {
    return gulp.src(rootDir + '/**/testdata/**/*', { base: 'src' }).
        pipe(gulp.dest(outDir))
}

function compileWebview() {
    let s = webview.src()
        .pipe(cached('webview'))

    if (webview.options.sourceMap) {
        s = s.pipe(sourcemaps.init())
            .pipe(webview())
            .pipe(sourcemaps.write('./'))
    }

    return s.pipe(gulp.dest(webview.options.outDir))
}

// 编译当前的扩展
function compileExtension() {
    let s = extension.src()
        .pipe(cached('extension'))

    if (extension.options.sourceMap) {
        s = s.pipe(sourcemaps.init())
            .pipe(extension())
            .pipe(sourcemaps.write('./'))
    }

    return s.pipe(gulp.dest(outDir));
}

async function clean() {
    await del(webview.options.outDir + "/*.(js|js.map)");
    await del(outDir);
}

function watchExtension() {
    return gulp.watch(
        rootDir,
        {
            delay: 500,
            queue: true,
        },
        compileExtension,
    );
}

function watchWebview() {
    return gulp.watch(
        webview.options.rootDir,
        {
            delay: 500,
            queue: true,
        },
        compileWebview,
    );
}

function createVSIX() {
    return vsce.createVSIX();
}

// 发布当前的扩展
function publish() {
    return vsce.publish();
}

exports.compile = gulp.series(
    clean,
    compileExtension,
    copy,
    compileWebview,
);

exports.clean = clean;

exports.publish = gulp.series(
    createVSIX,
    publish,
);

exports.package = gulp.series(
    compileExtension,
    createVSIX,
);

exports.watch = gulp.parallel(
    watchWebview,
    watchExtension,
);
