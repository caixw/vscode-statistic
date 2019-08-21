// SPDX-License-Identifier: MIT

'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const cached = require('gulp-cached');
const vsce = require('vsce');

const extension = ts.createProject('tsconfig.json');

// 编译当前的扩展
async function compileExtension() {
    let s = extension.src()
        .pipe(cached('watch'))

    if (extension.options.sourceMap) {
        s = s.pipe(sourcemaps.init())
            .pipe(extension())
            .pipe(await sourcemaps.write('./'))
    }

    s.pipe(gulp.dest(extension.options.outDir));
}

function clean() {
    return del(extension.options.outDir);
}

function watch() {
    gulp.watch(
        extension.options.rootDir,
        {
            delay: 500,
            queue: true,
        },
        compileExtension,
    );
}

function createVSIX() {
    return vsce.createVSIX();
}

// 发布当前的扩展
function publish() {
    return vsce.publish();
}

exports.compile = compileExtension;
exports.clean = clean;
exports.watch = watch;
exports.publish = gulp.series(createVSIX, publish);
exports.package = gulp.series(compileExtension, createVSIX);
