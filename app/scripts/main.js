'use strict';

var angular = require('angular');
var LandingCtrl = require('./controllers/LandingCtrl');

var app = angular.module('portfolio', []);
app.controller('LandingCtrl', ['$scope', LandingCtrl]);
