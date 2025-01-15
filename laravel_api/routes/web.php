<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/print',function(){
    return view('health_inquiry');
});

Route::get('/print1',function(){
    return view('print');
})->name('print');