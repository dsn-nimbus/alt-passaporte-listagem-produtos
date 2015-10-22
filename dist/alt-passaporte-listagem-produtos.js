;(function(ng) {
  "use strict";

  ng.module('alt.passaporte-listagem-produtos', ['alt.passaporte-informacoes-autorizacao'])
    .provider('AltPassaporteUrlBaseListagemProdutos', [function() {
      this.url = '';

      this.$get = [function() {
        return this.url;
      }];
    }])
    .service('AltPassaporteListagemProdutosService', ['$http', '$q', 'AltPassaporteAuthorizationInfoService', 'AltPassaporteUrlBaseListagemProdutos', function($http, $q, AltPassaporteAuthorizationInfoService, AltPassaporteUrlBaseListagemProdutos) {
      var URL_PASSAPORTE_PRODUTOS = AltPassaporteUrlBaseListagemProdutos + '/passaporte-rest-api/rest/produtos';

      this._altPassaporteAuthorizationInfoService = new AltPassaporteAuthorizationInfoService(AltPassaporteUrlBaseListagemProdutos);

      this._parseHttp = function() {
        return $http.get(URL_PASSAPORTE_PRODUTOS).then(function(p) {
          return p.data || {};
        });
      };

      this.getProdutos = function getProdutos() {
        return $q.all([this._altPassaporteAuthorizationInfoService.getToken(), this._parseHttp()])
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
                 })
                 .catch(function(erro) {
                   return $q.reject(erro);
                 });
     };
    }]);

}(angular));
