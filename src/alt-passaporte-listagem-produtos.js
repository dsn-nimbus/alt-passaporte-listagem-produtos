;(function(ng) {
  "use strict";

  ng.module('alt.passaporte-listagem-produtos', ['alt.passaporte-informacoes-autorizacao'])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
  }])
  .provider('AltPassaporteUrlBaseListagemProdutos', [function() {
    this.url = '';

    this.$get = [function() {
      return this.url;
    }];
  }])
  .service('AltPassaporteListagemProdutosService', ['$http', '$q', 'AltPassaporteAuthorizationInfoService', 'AltPassaporteUrlBaseListagemProdutos', 
  function($http, $q, AltPassaporteAuthorizationInfoService, AltPassaporteUrlBaseListagemProdutos) {
    var URL_PASSAPORTE_PRODUTOS = AltPassaporteUrlBaseListagemProdutos + '/passaporte-rest-api/rest/produtos/:prop';

    this._altPassaporteAuthorizationInfoService = new AltPassaporteAuthorizationInfoService(AltPassaporteUrlBaseListagemProdutos);

    this._parseHttp = function(prop) {
      var url = URL_PASSAPORTE_PRODUTOS;

      url = angular.isUndefined(prop) ? url.replace('/:prop', '') : url.replace(':prop', prop);

      return $http.get(url).then(function(p) {
        return p.data || {};
      });
    };

    this._getProdutos = function(prop) {
      var self = this;

      return $q.all([this._altPassaporteAuthorizationInfoService.getToken(), this._parseHttp(prop)])
        .then(function(resultado) {
          var _token = resultado[0];
          var _produtosWrapper = resultado[1];

          ng.forEach(_produtosWrapper.habilitados, function(ph) {
            var _separadorInicial = /\?/.test(ph.urlAutenticacao) ? '&' : '?';
            ph.urlAutenticacao = ph.urlAutenticacao + _separadorInicial + 'info='
            + _token + '&idProduto='
            + ph.chave;
          });

        return _produtosWrapper;
      });
    }

    this.getProdutos = function getProdutos() {
      // retorna produtos habilitados e disponívels
      // {habilitados: [], disponiveis: []}

      return this._getProdutos(undefined);
    };

    this.getProdutosHabilitados = function getProdutos() {
      // retorna apenas os produtos habilitados
      // {habilitados: []}

      return this._getProdutos('habilitados');
    };
  }]);

}(angular));
