/*
 * PanDrugs Frontend
 *
 * Copyright (C) 2015 - 2017 Fátima Al-Shahrour, Elena Piñeiro,
 * Daniel Glez-Peña and Miguel Reboiro-Jato
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 */
'use strict';

/**
* @ngdoc service
* @name pandrugsFrontendApp.RestDatabase
* @description
* # RestDatabase
* Factory in the pandrugsFrontendApp.
*/
angular.module('pandrugsFrontendApp')
.factory('restDatabase', ['$q', '$timeout', '$filter', '$http', 'BACKEND',
  function restDatabaseFactory($q, $timeout, $filter, $http, BACKEND) {
    function constructQueryString(
      advancedQueryOptions,
      queryDirect,
      queryIndirect
    ) {
      // query server
      var cancerDrugStatus = '';
      if (advancedQueryOptions.cancerFda) {
        cancerDrugStatus += 'cancerDrugStatus=APPROVED&';
      }
      if (advancedQueryOptions.cancerClinical) {
        cancerDrugStatus += 'cancerDrugStatus=CLINICAL_TRIALS&';
      }
      if (cancerDrugStatus === '') {
        cancerDrugStatus = 'cancerDrugStatus=NONE&';
      }

      var nonCancerDrugStatus = '';
      if (advancedQueryOptions.otherClinical) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=CLINICAL_TRIALS&';
      }
      if (advancedQueryOptions.otherExperimental) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=EXPERIMENTAL&';
      }
      if (advancedQueryOptions.otherFda) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=APPROVED&';
      }
      if (nonCancerDrugStatus === '') {
        nonCancerDrugStatus = 'nonCancerDrugStatus=NONE&';
      }

      var cancers = '';
      if (advancedQueryOptions.hasCancerStatusSelected()
        && advancedQueryOptions.hasAnyCancerSelected()
        && !advancedQueryOptions.areAllCancerTypesSelected()
      ) {
        cancers = advancedQueryOptions.getSelectedCancerTypeNames()
          .map(function(cancerType) {
            return 'cancer=' + cancerType.toUpperCase();
          })
          .join('&');
        cancers += '&';
      }

      var target = '';
      if (advancedQueryOptions.target && advancedQueryOptions.marker) {
        target = 'target=BOTH&';
      } else if (advancedQueryOptions.target) {
        target = 'target=TARGET&';
      } else if (advancedQueryOptions.marker) {
        target = 'target=MARKER&';
      }

      var direct = '';
      if (queryDirect && queryIndirect) {
        direct = 'direct=BOTH&';
      } else if (queryDirect) {
        direct = 'direct=DIRECT&';
      } else if (queryIndirect) {
        direct = 'direct=INDIRECT&';
      }

      return cancerDrugStatus + nonCancerDrugStatus + cancers + target + direct;
    }

    function searchBy (
      queryType,
      queryValues,
      advancedQueryOptions,
      queryDirect,
      queryIndirect
    ) {
      var deferred = $q.defer();

      // build query string
      var queryString = '';
      for (var i = 0; i < queryValues.length; i++) {
        if (!angular.isUndefined(queryValues[i])) {
          queryValues[i] = queryValues[i].trim().toUpperCase();
          if (queryValues[i].length > 0) {
            queryString += queryType + '=' + queryValues[i] + '&';
          }
        }
      }

      queryString += constructQueryString(
        advancedQueryOptions,
        queryDirect,
        queryIndirect
      );

      $http.get(BACKEND.API + 'genedrug?' + queryString)
      .then(function(results) {
        deferred.resolve(results.data);
      });

      return deferred.promise;
    }


    function validValues(resource, query, maxResults) {
      return $http.get(BACKEND.API + resource, {
        params: {
          query: query.toUpperCase(),
          maxResults: maxResults === undefined ? 20 : maxResults
        }
      });
    }

    // Public API here
    return {
      rankedSearch: function(
        geneRankFile,
        advancedQueryOptions,
        queryDirect,
        queryIndirect
      ) {
        var deferred = $q.defer();

        var queryString = constructQueryString(
          advancedQueryOptions,
          queryDirect,
          queryIndirect
        );

        var fd = new FormData();
        fd.append('generank', geneRankFile);

        $http.post(BACKEND.API + 'genedrug?' + queryString, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(results) {
            deferred.resolve(results.data);
          }
        );

        return deferred.promise;
      },

      searchByGenes: function (
        genesArray,
        advancedQueryOptions,
        queryDirect,
        queryIndirect

      ) {
        return searchBy(
          'gene',
          genesArray,
          advancedQueryOptions,
          queryDirect,
          queryIndirect);
      },

      searchByDrugs: function (
        drugsArray,
        advancedQueryOptions,
        queryDirect,
        queryIndirect) {
        return searchBy(
          'drug',
          drugsArray,
          advancedQueryOptions,
          queryDirect,
          queryIndirect);
      },

      computationIdSearch: function (
        computationId,
        advancedQueryOptions,
        queryDirect,
        queryIndirect
      ) {
        var deferred = $q.defer();

        var queryString = constructQueryString(
          advancedQueryOptions,
          queryDirect,
          queryIndirect
        );

        $http.get(BACKEND.API + 'genedrug/fromComputationId?computationId=' + computationId + '&' + queryString)
        .then(function(results) {
          deferred.resolve(results.data);
        });

        return deferred.promise;
      },

      getCancerTypes: function() {
        var deferred = $q.defer();

        $http.get(BACKEND.API + 'cancer')
        .then(function(results) {
          deferred.resolve(results.data.cancer);
        });

        return deferred.promise;
      },

      getInteractingGenes: function(genes, degree) {
        var deferred = $q.defer();

        $http.get(BACKEND.API + 'gene/interactions', {params: {gene: genes, degree: degree}})
        .then(function(results) {
          deferred.resolve(results.data);
          }
        );
        return deferred.promise;
      },

      listGeneSymbols: function(query, maxResults) {
        return validValues('genedrug/gene', query, maxResults);
      },

      listDrugNames: function(query, maxResults) {
        return validValues('genedrug/drug', query, maxResults);
      },

      genesPresence: function(genes) {
        var split = 50;

        var iterations = Math.ceil(genes.length / split);
        var queries = [];
        for (var i = 0; i < iterations; i++) {

          var query = '?';
          for (var j = i * split; j < Math.min(i * split + split, genes.length); j++) {
            query += 'gene='+genes[j]+'&';
          }
          queries.push($http.get(BACKEND.API + 'genedrug/gene/presence'+query).then(function(results){
            return results.data;
          }));
        }

        return $q.all(queries).then(function(results) {
          var presence = {present: [], absent: []};
          results.forEach(function (result) {
            presence.present = presence.present.concat(result.present);
            presence.absent = presence.absent.concat(result.absent);
          });
          return presence;
        });

      }
    };
  }
]);
