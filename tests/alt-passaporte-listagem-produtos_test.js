"use strict";

describe('alt.passaporte-listagem-produtos', function() {
  var _rootScope, _httpBackend, _q, _AltPassaporteListagemProdutosService, _AltPassaporteUrlBase, _httpProvider;
  var TOKEN = 'abc123123';
  var BASE_URL_PASSAPORTE = 'http://123.com';
  var URL_PASSAPORTE_PRODUTOS = BASE_URL_PASSAPORTE + '/passaporte-rest-api/rest/produtos';
  var URL_PASSAPORTE_TOKEN = BASE_URL_PASSAPORTE + '/passaporte-rest-api/rest/authorization/token';

  beforeEach(module('alt.passaporte-listagem-produtos', function(AltPassaporteUrlBaseListagemProdutosProvider, $httpProvider) {
    AltPassaporteUrlBaseListagemProdutosProvider.url = BASE_URL_PASSAPORTE;
    _httpProvider = $httpProvider;
  }));

  beforeEach(inject(function($injector) {
    _rootScope = $injector.get('$rootScope');
    _httpBackend = $injector.get('$httpBackend');
    _q = $injector.get('$q');
    _AltPassaporteListagemProdutosService = $injector.get('AltPassaporteListagemProdutosService');
  }));

  describe('criação', function() {
    it('deve criar o service corretamente', function() {
        expect(typeof _AltPassaporteListagemProdutosService).toBe('object');
    });

    it('deve ter o $httpProvider.defaults.withCredentials setado como true', function() {
      expect(_httpProvider.defaults.withCredentials).toBe(true);
    })
  });

  describe('getProdutos', function() {
    it('deve tentar buscar os produtos, mas o servidor retorna erro', function() {
      spyOn(_AltPassaporteListagemProdutosService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.when(TOKEN);
      });

      _httpBackend.expectGET(URL_PASSAPORTE_PRODUTOS).respond(400);

      _AltPassaporteListagemProdutosService
        .getProdutos()
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
        });

      _httpBackend.flush();
    });

    it('deve buscar as informações corretamente', function() {
      spyOn(_AltPassaporteListagemProdutosService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.when(TOKEN);
      });

      _httpBackend.expectGET(URL_PASSAPORTE_PRODUTOS).respond(200);

      _AltPassaporteListagemProdutosService
        .getProdutos()
        .then(function(p) {
          expect(p).toBeDefined();
        })
        .catch(function() {
          expect(true).toBe(false);
        });

      _httpBackend.flush();
    });

    it('deve buscar as informações corretamente e fazer o parse das urls com os tokens - urlAutenticacao sem query string', function() {
      var _produtosHabilitadosResposta = [
        {urlAutenticacao: 'http://site1.com/auth', chave: '987654321', url: 'http://site1.com'},
        {urlAutenticacao: 'http://site2.com/auth', chave: '123456789', url: 'http://site2.com'},
        {urlAutenticacao: 'http://site3.com/auth', chave: '654987321', url: 'http://site3.com'}
      ];

      var _produtosDisponiveisResposta = [
        {url: 'http://site1.com'},
        {url: 'http://site2.com'},
        {url: 'http://site3.com'}
      ];

      var _produtosHabilitadosParsed = [
        {urlAutenticacao: 'http://site1.com/auth?info=abc123123&idProduto=987654321', chave: '987654321', url: 'http://site1.com'},
        {urlAutenticacao: 'http://site2.com/auth?info=abc123123&idProduto=123456789', chave: '123456789', url: 'http://site2.com'},
        {urlAutenticacao: 'http://site3.com/auth?info=abc123123&idProduto=654987321', chave: '654987321', url: 'http://site3.com'}
      ];

      var _produtoWrapper = {
        habilitados: _produtosHabilitadosResposta,
        disponiveis: _produtosDisponiveisResposta
      };

      spyOn(_AltPassaporteListagemProdutosService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.when(TOKEN);
      });

      _httpBackend.expectGET(URL_PASSAPORTE_PRODUTOS).respond(200, _produtoWrapper);

      _AltPassaporteListagemProdutosService
        .getProdutos()
        .then(function(pw) {
          expect(pw.habilitados).toEqual(_produtosHabilitadosParsed);
          expect(pw.disponiveis).toEqual(_produtosDisponiveisResposta);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

      _httpBackend.flush();
    });

   it('deve buscar as informações corretamente e fazer o parse das urls com os tokens - urlAutenticacao com query string', function() {
      var _produtosHabilitadosResposta = [
        {urlAutenticacao: 'http://site1.com/auth?qqcoisa', chave: '987654321', url: 'http://site1.com'},
        {urlAutenticacao: 'http://site2.com/auth?qqcoisa', chave: '123456789', url: 'http://site2.com'},
        {urlAutenticacao: 'http://site3.com/auth?qqcoisa', chave: '654987321', url: 'http://site3.com'}
      ];

      var _produtosDisponiveisResposta = [
        {url: 'http://site1.com'},
        {url: 'http://site2.com'},
        {url: 'http://site3.com'}
      ];

      var _produtosHabilitadosParsed = [
        {urlAutenticacao: 'http://site1.com/auth?qqcoisa&info=abc123123&idProduto=987654321', chave: '987654321', url: 'http://site1.com'},
        {urlAutenticacao: 'http://site2.com/auth?qqcoisa&info=abc123123&idProduto=123456789', chave: '123456789', url: 'http://site2.com'},
        {urlAutenticacao: 'http://site3.com/auth?qqcoisa&info=abc123123&idProduto=654987321', chave: '654987321', url: 'http://site3.com'}
      ];

      var _produtoWrapper = {
        habilitados: _produtosHabilitadosResposta,
        disponiveis: _produtosDisponiveisResposta
      };

      spyOn(_AltPassaporteListagemProdutosService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.when(TOKEN);
      });

      _httpBackend.expectGET(URL_PASSAPORTE_PRODUTOS).respond(200, _produtoWrapper);

      _AltPassaporteListagemProdutosService
        .getProdutos()
        .then(function(pw) {
          expect(pw.habilitados).toEqual(_produtosHabilitadosParsed);
          expect(pw.disponiveis).toEqual(_produtosDisponiveisResposta);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

      _httpBackend.flush();
    });

    it('deve buscar as informações corretamente e fazer o parse das urls com os tokens - urlAutenticacao com query string', function() {
      var _produtosHabilitadosResposta = [
        {urlAutenticacao: 'http://site1.com/auth?qqcoisa', chave: '987654321', url: 'http://site1.com'},
        {urlAutenticacao: 'http://site2.com/auth?qqcoisa', chave: '123456789', url: 'http://site2.com'},
        {urlAutenticacao: 'http://site3.com/auth?qqcoisa', chave: '654987321', url: 'http://site3.com'}
      ];

      var _token = {
        token: 'abc123123'
      };

      var _produtosDisponiveisResposta = [
        {url: 'http://site1.com'},
        {url: 'http://site2.com'},
        {url: 'http://site3.com'}
      ];

      var _produtosHabilitadosParsed = [
        {urlAutenticacao: 'http://site1.com/auth?qqcoisa&info=abc123123&idProduto=987654321', chave: '987654321', url: 'http://site1.com'},
        {urlAutenticacao: 'http://site2.com/auth?qqcoisa&info=abc123123&idProduto=123456789', chave: '123456789', url: 'http://site2.com'},
        {urlAutenticacao: 'http://site3.com/auth?qqcoisa&info=abc123123&idProduto=654987321', chave: '654987321', url: 'http://site3.com'}
      ];

      var _produtoWrapper = {
        habilitados: _produtosHabilitadosResposta,
        disponiveis: _produtosDisponiveisResposta
      };

      _httpBackend.expectGET(URL_PASSAPORTE_TOKEN).respond(200, _token);
      _httpBackend.expectGET(URL_PASSAPORTE_PRODUTOS).respond(200, _produtoWrapper);

      _AltPassaporteListagemProdutosService
        .getProdutos()
        .then(function(pw) {
          expect(pw.habilitados).toEqual(_produtosHabilitadosParsed);
          expect(pw.disponiveis).toEqual(_produtosDisponiveisResposta);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

      _httpBackend.flush();
    });
  });
});
