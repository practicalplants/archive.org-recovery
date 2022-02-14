<?php 
class PracticalPlants_Masthead{
	public $tabs = array(
		'wiki'=>array(
			'title'=>'Wiki',
			'url'=>'/wiki'
		)//,
		// 'community'=>array(
		// 	'title'=>'Community',
		// 	'url'=>'/community'
		// ),
		// 'account'=>array(
		// 	'title'=> 'Login',
		// 	'url'=>'/sso'
		//)
	);
	
	public $active_tab = 'wiki';
	
	public function __construct($opts = array()){
		if(isset($opts['active_tab'])){
			$this->setActiveTab($opts['active_tab']);
		}
		$this->tabs['account']['title'] = (isset($_COOKIE['SSO-Authed']) ? 'Account' : 'Login / Register');
	}
	
	function setActiveTab($id){
		if(isset($this->tabs[$id])){
			$this->active_tab = $id;
		}
	}
	
	function draw(){
		ob_start();
?><nav id="masthead"><div id="logo"><a href="/wiki/" id="logo-image"></a><h1><a href="/wiki/"><em>Practical</em> Plants</a></h1></div>

	<ul class="tabs">
	<?php foreach($this->tabs as $id=>$tab){ ?>
	<li class="<?php if($this->active_tab==$id){?>active<?php } ?>"><a href="<?php echo $tab['url'] ?>"><?php echo $tab['title'] ?></a></li><?php } ?>
	</ul>
	<div id="wiki-search">
		<form action="/wiki/index.php" id="searchform">
			<input type="hidden" name="title" value="Special:Search">
			<input name="search" title="Search Practical Plants [ctrl-option-f]" accesskey="f" id="searchInput" placeholder="Species/Taxonomy name or search term" class="search-field">			<input type="submit" name="go" value="Go" title="Go to a page with this exact name if exists" id="searchGoButton" class="searchButton">			<input type="submit" name="fulltext" value="Search" title="Search the pages for this text" id="mw-searchButton" class="searchButton">		</form>
	</div>
</nav><?php
		$html = ob_get_contents();
		ob_end_clean();
		return $html;
	}
	
	function output(){
		echo $this->draw();
	}
}
?>