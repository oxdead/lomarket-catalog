<?php
class ControllerCommonHeader extends Controller {
	private function addHeaderStyle($styleFile)
	{
		if(file_exists(DIR_TEMPLATE.'default/stylesheet/'.$styleFile)) {
			$this->document->addStyle('catalog/view/theme/default/stylesheet/'.$styleFile);
		}
	}

	public function index() {
		// Analytics
		$this->load->model('setting/extension');

		$data['analytics'] = array();

		$analytics = $this->model_setting_extension->getExtensions('analytics');

		foreach ($analytics as $analytic) {
			if ($this->config->get('analytics_' . $analytic['code'] . '_status')) {
				$data['analytics'][] = $this->load->controller('extension/analytics/' . $analytic['code'], $this->config->get('analytics_' . $analytic['code'] . '_status'));
			}
		}

		if ($this->request->server['HTTPS']) {
			$server = $this->config->get('config_ssl');
		} else {
			$server = $this->config->get('config_url');
		}

		if (is_file(DIR_IMAGE . $this->config->get('config_icon'))) {
			$this->document->addLink($server . 'image/' . $this->config->get('config_icon'), 'icon');
		}


		
		//add custom header css file
		$this->addHeaderStyle('common-header.css');
		
		//add other custom css files depending on route
		$route = empty($this->request->get['route']) ? 'common/home' : $this->request->get['route'];

		$resources = [
			'common/home' => ['home-catalog-menu.css', 'extension-module-featured.css'],
			'checkout/checkout' => ['checkout-checkout.css'],
			'product/category' => ['product-category.css'],
			'product/product' => ['product-product.css'],
			'product/compare' => ['product-compare.css'],
			'account/login' => ['account-login.css'],
			'account/forgotten' => ['account-forgotten.css'],
			'account/register' => ['account-register.css'],
		];

		foreach($resources as $routeKey => $cssArr){
			if($route === $routeKey){
				foreach($cssArr as $css){ $this->addHeaderStyle($css); }
				break;
			}
		}
	
		
		// $route = empty($this->request->get['route']) ? 'common/home' : $this->request->get['route'];
		// $css_file = str_replace('/', '-', $route) . '.css';
		// if(file_exists(DIR_TEMPLATE.'stylesheet/'.$css_file)) {
		// 	$this->document->addStyle('catalog/view/theme/default/stylesheet/'.$css_file);
		// }
		
		$data['title'] = $this->document->getTitle();

		$data['base'] = $server;
		$data['description'] = $this->document->getDescription();
		$data['keywords'] = $this->document->getKeywords();
		$data['links'] = $this->document->getLinks();
		$data['styles'] = $this->document->getStyles();
		$data['scripts'] = $this->document->getScripts('header');
		$data['lang'] = $this->language->get('code');
		$data['direction'] = $this->language->get('direction');

		$data['name'] = $this->config->get('config_name');

		if (is_file(DIR_IMAGE . $this->config->get('config_logo'))) {
			$data['logo'] = $server . 'image/' . $this->config->get('config_logo');
		} else {
			$data['logo'] = '';
		}

		$this->load->language('common/header');

		// Wishlist
		if ($this->customer->isLogged()) {
			$this->load->model('account/wishlist');
			$data['text_wishlist'] = $this->language->get('text_wishlist');
			$data['text_wishlist_count'] = sprintf('%s', $this->model_account_wishlist->getTotalWishlist());
		} else {
			$data['text_wishlist'] = $this->language->get('text_wishlist');
			$data['text_wishlist_count'] = sprintf('%s', isset($this->session->data['wishlist']) ? count($this->session->data['wishlist']) : 0);
		}

		$data['text_compare_count'] = sprintf('%s', isset($this->session->data['compare']) ? count($this->session->data['compare']) : 0);
		$data['text_items_count'] = sprintf('%s', $this->cart->countProducts() + (isset($this->session->data['vouchers']) ? count($this->session->data['vouchers']) : 0));

		$data['text_logged'] = sprintf($this->language->get('text_logged'), $this->url->link('account/account', '', true), $this->customer->getFirstName(), $this->url->link('account/logout', '', true));
		
		$data['home'] = $this->url->link('common/home');
		$data['wishlist'] = $this->url->link('account/wishlist', '', true);
		$data['logged'] = $this->customer->isLogged();
		$data['account'] = $this->url->link('account/account', '', true);
		$data['register'] = $this->url->link('account/register', '', true);
		$data['login'] = $this->url->link('account/login', '', true);
		$data['order'] = $this->url->link('account/order', '', true);
		$data['transaction'] = $this->url->link('account/transaction', '', true);
		$data['download'] = $this->url->link('account/download', '', true);
		$data['logout'] = $this->url->link('account/logout', '', true);
		$data['shopping_cart'] = $this->url->link('checkout/cart');
		$data['checkout'] = $this->url->link('checkout/checkout', '', true);
		$data['compare'] = $this->url->link('product/compare', '');
		$data['contact'] = $this->url->link('information/contact');
		$data['telephone'] = $this->config->get('config_telephone');
		
		$data['language'] = $this->load->controller('common/language');
		$data['currency'] = $this->load->controller('common/currency');
		$data['search'] = $this->load->controller('common/search');
		$data['cart'] = $this->load->controller('common/cart');
		// $data['menu'] = $this->load->controller('common/menu');



		return $this->load->view('common/header', $data);
	}
}
