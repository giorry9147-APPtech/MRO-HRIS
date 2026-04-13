<?php

namespace Database\Seeders;

use App\Models\Directorate;
use App\Models\Department;
use App\Models\JobFunction;
use Illuminate\Database\Seeder;

class OrganogramSeeder extends Seeder
{
	public function run(): void
	{
		$this->seedJobFunctions();
		$this->seedDirectoratesAndDepartments();
	}

	private function seedJobFunctions(): void
	{
		$functions = [
			// Leiding & Management
			['code' => 'FN_MINISTER', 'title' => 'Minister', 'description' => 'Politiek hoofd van het ministerie'],
			['code' => 'FN_SG', 'title' => 'Secretaris-Generaal', 'description' => 'Hoogste ambtelijke leiding van het ministerie'],
			['code' => 'FN_DIRECTEUR', 'title' => 'Directeur', 'description' => 'Leiding van een directoraat'],
			['code' => 'FN_ONDERDIRECTEUR', 'title' => 'Onderdirecteur', 'description' => 'Plaatsvervangend hoofd van een directoraat of onderdirectoraat'],
			['code' => 'FN_AFDHOOFD', 'title' => 'Afdelingshoofd', 'description' => 'Leiding van een afdeling'],
			['code' => 'FN_BUREAUHOOFD', 'title' => 'Bureauhoofd', 'description' => 'Leiding van een bureau binnen een afdeling'],

			// Beleidsmatig / Professioneel
			['code' => 'FN_BELEIDSMDW', 'title' => 'Beleidsmedewerker', 'description' => 'Ontwikkelt en evalueert beleid'],
			['code' => 'FN_JURADV', 'title' => 'Juridisch Adviseur', 'description' => 'Juridische ondersteuning en advisering'],
			['code' => 'FN_PROJCOORD', 'title' => 'Projectcoördinator', 'description' => 'Coördineert projecten en programma\'s'],
			['code' => 'FN_LANDBOUWING', 'title' => 'Landbouwkundig Ingenieur', 'description' => 'Agrarisch-technische ondersteuning en advisering'],
			['code' => 'FN_VEETEELT', 'title' => 'Veeteelt Specialist', 'description' => 'Deskundige op het gebied van veeteelt'],
			['code' => 'FN_VISSERIJ', 'title' => 'Visserij Specialist', 'description' => 'Deskundige op het gebied van visserij en aquacultuur'],
			['code' => 'FN_GEMONTW', 'title' => 'Gemeenschapsontwikkelaar', 'description' => 'Werkt aan ontwikkeling en empowerment van gemeenschappen'],
			['code' => 'FN_DC', 'title' => 'Districtscommissaris', 'description' => 'Bestuurlijk hoofd van een district'],
			['code' => 'FN_BESTOPZ', 'title' => 'Bestuursopziener', 'description' => 'Ondersteuning van het districtsbestuur op ressort-niveau'],
			['code' => 'FN_INTCONTROLEUR', 'title' => 'Interne Controleur', 'description' => 'Bewaakt naleving van procedures en regelgeving'],
			['code' => 'FN_VOORLICHTER', 'title' => 'Voorlichter', 'description' => 'Communicatie en public relations'],

			// Administratief / Ondersteuning
			['code' => 'FN_ADMINMDW', 'title' => 'Administratief Medewerker', 'description' => 'Algemene administratieve werkzaamheden'],
			['code' => 'FN_SECRETARESSE', 'title' => 'Secretaresse', 'description' => 'Secretariële ondersteuning'],
			['code' => 'FN_FINMDW', 'title' => 'Financieel Medewerker', 'description' => 'Financiële administratie en begrotingsbeheer'],
			['code' => 'FN_PERSMDW', 'title' => 'Personeelsmedewerker', 'description' => 'Personeelsbeheer en HR-administratie'],
			['code' => 'FN_ICTMDW', 'title' => 'ICT Medewerker', 'description' => 'Beheer van informatiesystemen en technische ondersteuning'],
			['code' => 'FN_DOCUMENTALIST', 'title' => 'Documentalist', 'description' => 'Archivering en documentbeheer'],

			// Operationeel / Facilitair
			['code' => 'FN_VELDMDW', 'title' => 'Veldmedewerker', 'description' => 'Uitvoerend werk in het veld / binnenland'],
			['code' => 'FN_CHAUFFEUR', 'title' => 'Chauffeur', 'description' => 'Vervoer van personeel en materiaal'],
			['code' => 'FN_BEWAKER', 'title' => 'Bewaker', 'description' => 'Beveiliging van gebouwen en terreinen'],
			['code' => 'FN_SCHOONMAKER', 'title' => 'Schoonmaker', 'description' => 'Schoonmaak en onderhoud van gebouwen'],
			['code' => 'FN_MAGAZIJNBEH', 'title' => 'Magazijnbeheerder', 'description' => 'Beheer van opslag en materialen'],
			['code' => 'FN_CONCIERGE', 'title' => 'Conciërge', 'description' => 'Gebouwbeheer en facilitaire ondersteuning'],
		];

		foreach ($functions as $fn) {
			JobFunction::firstOrCreate(
				['code' => $fn['code']],
				['title' => $fn['title'], 'description' => $fn['description'], 'is_active' => true]
			);
		}
	}

	private function seedDirectoratesAndDepartments(): void
	{
		// Helper: use code as unique key, directorate/parent as values
		$dept = fn(int $dirId, string $code, string $name, ?int $parentId = null) =>
			Department::firstOrCreate(
				['code' => $code],
				['directorate_id' => $dirId, 'parent_department_id' => $parentId, 'name' => $name, 'status' => 'active']
			);

		// 1. Directoraat Regionale Ontwikkeling (blauw)
		$dir1 = Directorate::firstOrCreate(
			['code' => 'DIR_REG_ONTW'],
			[
				'name' => 'Directoraat Regionale Ontwikkeling',
				'description' => 'Blauw',
				'status' => 'active',
			]
		);

		// Ondersteunende/centrale units
		$dir1_secretariaat = $dept($dir1->id, 'DIR_REG_ONTW_SECR', 'Secretariaat');
		$dept($dir1->id, 'DIR_REG_ONTW_OPM', 'OPM');
		$dept($dir1->id, 'DIR_REG_ONTW_DIV', 'Documentaire Informatie Verzorging');
		$dept($dir1->id, 'DIR_REG_ONTW_IC', 'Interne Controle');
		$dept($dir1->id, 'DIR_REG_ONTW_ICT', 'Informatie Communicatie Technologie');
		$dept($dir1->id, 'DIR_REG_ONTW_BP', 'Burger Participatie');

		// Afdelingen
		$dept($dir1->id, 'DIR_REG_ONTW_COMM', 'Commissariaten');

		$districts_dept = $dept($dir1->id, 'DIR_REG_ONTW_DIST', 'Districts Bestuur & Decentralisatie');

		// Sub-onderdelen van Districts Bestuur & Decentralisatie
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_SECR', 'Secretariaat', $districts_dept->id);
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_INKOM', 'Districts inkomsten/uitgaven', $districts_dept->id);
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_WETGEV', 'Regionale organen en wetgeving', $districts_dept->id);
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_BOUWAFD', 'Bouwkundige afdeling', $districts_dept->id);
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_CIVTEC', 'Civiel Technische Afdeling', $districts_dept->id);
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_MARK', 'Markten, staatslogeergebouwen & vuilophaal', $districts_dept->id);
		$dept($dir1->id, 'DIR_REG_ONTW_DIST_WATER', 'Waterschappen', $districts_dept->id);

		// OD Administratieve Diensten
		$admin_services = $dept($dir1->id, 'DIR_REG_ONTW_OPAD', 'OD Administratieve Diensten');
		$dept($dir1->id, 'DIR_REG_ONTW_OPAD_SECR', 'Secretariaat', $admin_services->id);
		$dept($dir1->id, 'DIR_REG_ONTW_OPAD_ALGZAKEN', 'Algemene Zaken', $admin_services->id);
		$dept($dir1->id, 'DIR_REG_ONTW_OPAD_PERSZ', 'Personeelszaken', $admin_services->id);

		// OD Financieel Beheer
		$fin_beheer = $dept($dir1->id, 'DIR_REG_ONTW_OPFIN', 'OD Financieel Beheer');
		$dept($dir1->id, 'DIR_REG_ONTW_OPFIN_SECR', 'Secretariaat', $fin_beheer->id);
		$dept($dir1->id, 'DIR_REG_ONTW_OPFIN_BEGR', 'Begroting & Financiële zaken', $fin_beheer->id);

		// 2. Directoraat Duurzame Ontwikkeling Inheemsen (oker/geel)
		$dir2 = Directorate::firstOrCreate(
			['code' => 'DIR_ONTW_INH'],
			[
				'name' => 'Directoraat Duurzame Ontwikkeling Inheemsen',
				'description' => 'Oker/geel',
				'status' => 'active',
			]
		);

		$dept($dir2->id, 'DIR_ONTW_IHN_SECR', 'Secretariaat');
		$dept($dir2->id, 'DIR_ONTW_IHN_DIV', 'Documentaire Informatie Verzorging');
		$dept($dir2->id, 'DIR_ONTW_IHN_IC', 'Interne Controle');

		// Ontwikkelingsdienst
		$dev_service = $dept($dir2->id, 'DIR_ONTW_IHN_ONTW', 'Ontwikkelingsdienst');
		$dept($dir2->id, 'DIR_ONTW_IHN_ONTW_SECR', 'Secretariaat', $dev_service->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_ONTW_ICT', 'Informatie Communicatie Technologie', $dev_service->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_ONTW_DOC', 'Documentatie en Informatie', $dev_service->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_ONTW_PROJ', 'Project ontwikkeling en training', $dev_service->id);

		// Gemeenschapsontwikkeling
		$comm_dev = $dept($dir2->id, 'DIR_ONTW_IHN_GEMEENTW', 'Gemeenschapsontwikkeling');
		$dept($dir2->id, 'DIR_ONTW_IHN_GEMEENTW_SECR', 'Secretariaat', $comm_dev->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_GEMEENTW_ZUID', 'GO Zuid Suriname', $comm_dev->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_GEMEENTW_OOST', 'GO Oost Suriname', $comm_dev->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_GEMEENTW_WEST', 'GO West Suriname', $comm_dev->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_GEMEENTW_MIDDEN', 'GO Midden Suriname', $comm_dev->id);

		// Administratieve Diensten
		$admin_services_2 = $dept($dir2->id, 'DIR_ONTW_IHN_ADMINDIENST', 'Administratieve Diensten');
		$dept($dir2->id, 'DIR_ONTW_IHN_ADMINDIENST_SECR', 'Secretariaat', $admin_services_2->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_ADMINDIENST_ALG', 'Algemene Zaken', $admin_services_2->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_ADMINDIENST_PERSZ', 'Personeelszaken', $admin_services_2->id);
		$dept($dir2->id, 'DIR_ONTW_IHN_ADMINDIENST_BEGR', 'Begroting & Financiële zaken', $admin_services_2->id);

		// 3. Directoraat Duurzame Ontwikkeling Afro Surinamers Binnenland (rood)
		$dir3 = Directorate::firstOrCreate(
			['code' => 'DIR_ONTW_AFRO'],
			[
				'name' => 'Directoraat Duurzame Ontwikkeling Afro Surinamers Binnenland',
				'description' => 'Rood',
				'status' => 'active',
			]
		);

		$dept($dir3->id, 'DIR_ONTW_AFRO_SECR', 'Secretariaat');
		$dept($dir3->id, 'DIR_ONTW_AFRO_DIV', 'Documentaire Informatie Verzorging');
		$dept($dir3->id, 'DIR_ONTW_AFRO_IC', 'Interne Controle');

		// Ontwikkelingsdienst
		$dev_service_3 = $dept($dir3->id, 'DIR_ONTW_AFRO_ONTW', 'Ontwikkelingsdienst');
		$dept($dir3->id, 'DIR_ONTW_AFRO_ONTW_SECR', 'Secretariaat', $dev_service_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_ONTW_ICT', 'Informatie Communicatie Technologie', $dev_service_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_ONTW_PROJ', 'Project Ontwikkeling en training', $dev_service_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_ONTW_DOC', 'Documentatie en informatie', $dev_service_3->id);

		// Gemeenschapsontwikkeling
		$comm_dev_3 = $dept($dir3->id, 'DIR_ONTW_AFRO_GEMEENTW', 'Gemeenschapsontwikkeling');
		$dept($dir3->id, 'DIR_ONTW_AFRO_GEMEENTW_SECR', 'Secretariaat', $comm_dev_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_GEMEENTW_WEST', 'GO West Suriname', $comm_dev_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_GEMEENTW_OOST', 'GO Oost Suriname', $comm_dev_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_GEMEENTW_MIDDEN', 'GO Midden Suriname', $comm_dev_3->id);

		// Administratieve Diensten
		$admin_services_3 = $dept($dir3->id, 'DIR_ONTW_AFRO_ADMINDIENST', 'Administratieve Diensten');
		$dept($dir3->id, 'DIR_ONTW_AFRO_ADMINDIENST_SECR', 'Secretariaat', $admin_services_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_ADMINDIENST_ALG', 'Algemene Zaken', $admin_services_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_ADMINDIENST_PERSZ', 'Personeelszaken', $admin_services_3->id);
		$dept($dir3->id, 'DIR_ONTW_AFRO_ADMINDIENST_BEGR', 'Begroting & Financiële zaken', $admin_services_3->id);

		// 4. Directoraat Agrarische Ontwikkeling Binnenland (paars/grijs)
		$dir4 = Directorate::firstOrCreate(
			['code' => 'DIR_AGRARISCHE_ONTW'],
			[
				'name' => 'Directoraat Agrarische Ontwikkeling Binnenland',
				'description' => 'Paars/grijs',
				'status' => 'active',
			]
		);

		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_SECR', 'Secretariaat');
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_DIV', 'Documentaire Informatie Verzorging');
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_IC', 'Interne Controle');

		// OD Veeteelt & Visserij
		$cattle_fish = $dept($dir4->id, 'DIR_AGRARISCHE_ONTW_VEETEELT', 'OD Veeteelt & Visserij');
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_VEETEELT_SECR', 'Secretariaat', $cattle_fish->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_VEETEELT_OOST', 'Agrarische Ontw Regio Oost', $cattle_fish->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_VEETEELT_MIDDEN', 'Agrarische Ontw Regio Midden', $cattle_fish->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_VEETEELT_WEST', 'Agrarische Ontw Regio West', $cattle_fish->id);

		// OD Landbouw
		$agriculture = $dept($dir4->id, 'DIR_AGRARISCHE_ONTW_LANDBOUW', 'OD Landbouw');
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_LANDBOUW_SECR', 'Secretariaat', $agriculture->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_LANDBOUW_OOST', 'Agrarische Ontw Regio Oost', $agriculture->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_LANDBOUW_MIDDEN', 'Agrarische Ontw Regio Midden', $agriculture->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_LANDBOUW_WEST', 'Agrarische Ontw Regio West', $agriculture->id);

		// Administratieve Diensten
		$admin_services_4 = $dept($dir4->id, 'DIR_AGRARISCHE_ONTW_ADMINDIENST', 'Administratieve Diensten');
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_ADMINDIENST_SECR', 'Secretariaat', $admin_services_4->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_ADMINDIENST_ALG', 'Algemene Zaken', $admin_services_4->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_ADMINDIENST_PERSZ', 'Personeelszaken', $admin_services_4->id);
		$dept($dir4->id, 'DIR_AGRARISCHE_ONTW_ADMINDIENST_BEGR', 'Begroting & Financiële zaken', $admin_services_4->id);

		// 5. Kabinet van de Minister (groen)
		$dir5 = Directorate::firstOrCreate(
			['code' => 'KAB_MINISTER'],
			[
				'name' => 'Kabinet van de Minister',
				'description' => 'Groen – Directe ondersteuning van de Minister',
				'status' => 'active',
			]
		);

		$dept($dir5->id, 'KAB_MIN_SECR', 'Secretariaat Minister');
		$dept($dir5->id, 'KAB_MIN_VOORL', 'Voorlichting');
		$dept($dir5->id, 'KAB_MIN_PROTO', 'Protocol & Externe Betrekkingen');
		$dept($dir5->id, 'KAB_MIN_JURIDISCH', 'Juridische Zaken');
		$dept($dir5->id, 'KAB_MIN_BELEID', 'Beleidsontwikkeling & Planning');
		$dept($dir5->id, 'KAB_MIN_SG', 'Bureau Secretaris-Generaal');
	}
}
