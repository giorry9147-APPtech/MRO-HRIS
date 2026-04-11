<?php

namespace Database\Seeders;

use App\Models\Directorate;
use App\Models\Department;
use Illuminate\Database\Seeder;

class OrganogramSeeder extends Seeder
{
	public function run(): void
	{
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
		$dir1_secretariaat = Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_OPM'],
			['name' => 'OPM', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_DIV'],
			['name' => 'Documentaire Informatie Verzorging', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_IC'],
			['name' => 'Interne Controle', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_ICT'],
			['name' => 'Informatie Communicatie Technologie', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_BP'],
			['name' => 'Burger Participatie', 'status' => 'active']
		);

		// Afdelingen
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_COMM'],
			['name' => 'Commissariaten', 'status' => 'active']
		);

		$districts_dept = Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_DIST'],
			['name' => 'Districts Bestuur & Decentralisatie', 'status' => 'active']
		);

		// Sub-onderdelen van Districts Bestuur & Decentralisatie
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_INKOM'],
			['name' => 'Districts inkomsten/uitgaven', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_WETGEV'],
			['name' => 'Regionale organen en wetgeving', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_BOUWAFD'],
			['name' => 'Bouwkundige afdeling', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_CIVTEC'],
			['name' => 'Civiel Technische Afdeling', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_MARK'],
			['name' => 'Markten, staatslogeergebouwen & vuilophaal', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $districts_dept->id, 'code' => 'DIR_REG_ONTW_DIST_WATER'],
			['name' => 'Waterschappen', 'status' => 'active']
		);

		// OD Administratieve Diensten
		$admin_services = Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_OPAD'],
			['name' => 'OD Administratieve Diensten', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $admin_services->id, 'code' => 'DIR_REG_ONTW_OPAD_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $admin_services->id, 'code' => 'DIR_REG_ONTW_OPAD_ALGZAKEN'],
			['name' => 'Algemene Zaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $admin_services->id, 'code' => 'DIR_REG_ONTW_OPAD_PERSZ'],
			['name' => 'Personeelszaken', 'status' => 'active']
		);

		// OD Financieel Beheer
		$fin_beheer = Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'code' => 'DIR_REG_ONTW_OPFIN'],
			['name' => 'OD Financieel Beheer', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $fin_beheer->id, 'code' => 'DIR_REG_ONTW_OPFIN_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir1->id, 'parent_department_id' => $fin_beheer->id, 'code' => 'DIR_REG_ONTW_OPFIN_BEGR'],
			['name' => 'Begroting & Financiële zaken', 'status' => 'active']
		);

		// 2. Directoraat Duurzame Ontwikkeling Inheemsen (oker/geel)
		$dir2 = Directorate::firstOrCreate(
			['code' => 'DIR_ONTW_INH'],
			[
				'name' => 'Directoraat Duurzame Ontwikkeling Inheemsen',
				'description' => 'Oker/geel',
				'status' => 'active',
			]
		);

		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'code' => 'DIR_ONTW_IHN_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'code' => 'DIR_ONTW_IHN_DIV'],
			['name' => 'Documentaire Informatie Verzorging', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'code' => 'DIR_ONTW_IHN_IC'],
			['name' => 'Interne Controle', 'status' => 'active']
		);

		// Ontwikkelingsdienst
		$dev_service = Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'code' => 'DIR_ONTW_IHN_ONTW'],
			['name' => 'Ontwikkelingsdienst', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $dev_service->id, 'code' => 'DIR_ONTW_IHN_ONTW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $dev_service->id, 'code' => 'DIR_ONTW_IHN_ONTW_ICT'],
			['name' => 'Informatie Communicatie Technologie', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $dev_service->id, 'code' => 'DIR_ONTW_IHN_ONTW_DOC'],
			['name' => 'Documentatie en Informatie', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $dev_service->id, 'code' => 'DIR_ONTW_IHN_ONTW_PROJ'],
			['name' => 'Project ontwikkeling en training', 'status' => 'active']
		);

		// Gemeenschapsontwikkeling
		$comm_dev = Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'code' => 'DIR_ONTW_IHN_GEMEENTW'],
			['name' => 'Gemeenschapsontwikkeling', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $comm_dev->id, 'code' => 'DIR_ONTW_IHN_GEMEENTW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $comm_dev->id, 'code' => 'DIR_ONTW_IHN_GEMEENTW_ZUID'],
			['name' => 'GO Zuid Suriname', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $comm_dev->id, 'code' => 'DIR_ONTW_IHN_GEMEENTW_OOST'],
			['name' => 'GO Oost Suriname', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $comm_dev->id, 'code' => 'DIR_ONTW_IHN_GEMEENTW_WEST'],
			['name' => 'GO West Suriname', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $comm_dev->id, 'code' => 'DIR_ONTW_IHN_GEMEENTW_MIDDEN'],
			['name' => 'GO Midden Suriname', 'status' => 'active']
		);

		// Administratieve Diensten
		$admin_services_2 = Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'code' => 'DIR_ONTW_IHN_ADMINDIENST'],
			['name' => 'Administratieve Diensten', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $admin_services_2->id, 'code' => 'DIR_ONTW_IHN_ADMINDIENST_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $admin_services_2->id, 'code' => 'DIR_ONTW_IHN_ADMINDIENST_ALG'],
			['name' => 'Algemene Zaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $admin_services_2->id, 'code' => 'DIR_ONTW_IHN_ADMINDIENST_PERSZ'],
			['name' => 'Personeelszaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir2->id, 'parent_department_id' => $admin_services_2->id, 'code' => 'DIR_ONTW_IHN_ADMINDIENST_BEGR'],
			['name' => 'Begroting & Financiële zaken', 'status' => 'active']
		);

		// 3. Directoraat Duurzame Ontwikkeling Afro Surinamers Binnenland (rood)
		$dir3 = Directorate::firstOrCreate(
			['code' => 'DIR_ONTW_AFRO'],
			[
				'name' => 'Directoraat Duurzame Ontwikkeling Afro Surinamers Binnenland',
				'description' => 'Rood',
				'status' => 'active',
			]
		);

		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'code' => 'DIR_ONTW_AFRO_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'code' => 'DIR_ONTW_AFRO_DIV'],
			['name' => 'Documentaire Informatie Verzorging', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'code' => 'DIR_ONTW_AFRO_IC'],
			['name' => 'Interne Controle', 'status' => 'active']
		);

		// Ontwikkelingsdienst
		$dev_service_3 = Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'code' => 'DIR_ONTW_AFRO_ONTW'],
			['name' => 'Ontwikkelingsdienst', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $dev_service_3->id, 'code' => 'DIR_ONTW_AFRO_ONTW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $dev_service_3->id, 'code' => 'DIR_ONTW_AFRO_ONTW_ICT'],
			['name' => 'Informatie Communicatie Technologie', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $dev_service_3->id, 'code' => 'DIR_ONTW_AFRO_ONTW_PROJ'],
			['name' => 'Project Ontwikkeling en training', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $dev_service_3->id, 'code' => 'DIR_ONTW_AFRO_ONTW_DOC'],
			['name' => 'Documentatie en informatie', 'status' => 'active']
		);

		// Gemeenschapsontwikkeling
		$comm_dev_3 = Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'code' => 'DIR_ONTW_AFRO_GEMEENTW'],
			['name' => 'Gemeenschapsontwikkeling', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $comm_dev_3->id, 'code' => 'DIR_ONTW_AFRO_GEMEENTW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $comm_dev_3->id, 'code' => 'DIR_ONTW_AFRO_GEMEENTW_WEST'],
			['name' => 'GO West Suriname', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $comm_dev_3->id, 'code' => 'DIR_ONTW_AFRO_GEMEENTW_OOST'],
			['name' => 'GO Oost Suriname', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $comm_dev_3->id, 'code' => 'DIR_ONTW_AFRO_GEMEENTW_MIDDEN'],
			['name' => 'GO Midden Suriname', 'status' => 'active']
		);

		// Administratieve Diensten
		$admin_services_3 = Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'code' => 'DIR_ONTW_AFRO_ADMINDIENST'],
			['name' => 'Administratieve Diensten', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $admin_services_3->id, 'code' => 'DIR_ONTW_AFRO_ADMINDIENST_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $admin_services_3->id, 'code' => 'DIR_ONTW_AFRO_ADMINDIENST_ALG'],
			['name' => 'Algemene Zaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $admin_services_3->id, 'code' => 'DIR_ONTW_AFRO_ADMINDIENST_PERSZ'],
			['name' => 'Personeelszaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir3->id, 'parent_department_id' => $admin_services_3->id, 'code' => 'DIR_ONTW_AFRO_ADMINDIENST_BEGR'],
			['name' => 'Begroting & Financiële zaken', 'status' => 'active']
		);

		// 4. Directoraat Agrarische Ontwikkeling Binnenland (paars/grijs)
		$dir4 = Directorate::firstOrCreate(
			['code' => 'DIR_AGRARISCHE_ONTW'],
			[
				'name' => 'Directoraat Agrarische Ontwikkeling Binnenland',
				'description' => 'Paars/grijs',
				'status' => 'active',
			]
		);

		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'code' => 'DIR_AGRARISCHE_ONTW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'code' => 'DIR_AGRARISCHE_ONTW_DIV'],
			['name' => 'Documentaire Informatie Verzorging', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'code' => 'DIR_AGRARISCHE_ONTW_IC'],
			['name' => 'Interne Controle', 'status' => 'active']
		);

		// OD Veeteelt & Visserij
		$cattle_fish = Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'code' => 'DIR_AGRARISCHE_ONTW_VEETEELT'],
			['name' => 'OD Veeteelt & Visserij', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $cattle_fish->id, 'code' => 'DIR_AGRARISCHE_ONTW_VEETEELT_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $cattle_fish->id, 'code' => 'DIR_AGRARISCHE_ONTW_VEETEELT_OOST'],
			['name' => 'Agrarische Ontw Regio Oost', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $cattle_fish->id, 'code' => 'DIR_AGRARISCHE_ONTW_VEETEELT_MIDDEN'],
			['name' => 'Agrarische Ontw Regio Midden', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $cattle_fish->id, 'code' => 'DIR_AGRARISCHE_ONTW_VEETEELT_WEST'],
			['name' => 'Agrarische Ontw Regio West', 'status' => 'active']
		);

		// OD Landbouw
		$agriculture = Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'code' => 'DIR_AGRARISCHE_ONTW_LANDBOUW'],
			['name' => 'OD Landbouw', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $agriculture->id, 'code' => 'DIR_AGRARISCHE_ONTW_LANDBOUW_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $agriculture->id, 'code' => 'DIR_AGRARISCHE_ONTW_LANDBOUW_OOST'],
			['name' => 'Agrarische Ontw Regio Oost', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $agriculture->id, 'code' => 'DIR_AGRARISCHE_ONTW_LANDBOUW_MIDDEN'],
			['name' => 'Agrarische Ontw Regio Midden', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $agriculture->id, 'code' => 'DIR_AGRARISCHE_ONTW_LANDBOUW_WEST'],
			['name' => 'Agrarische Ontw Regio West', 'status' => 'active']
		);

		// Administratieve Diensten
		$admin_services_4 = Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'code' => 'DIR_AGRARISCHE_ONTW_ADMINDIENST'],
			['name' => 'Administratieve Diensten', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $admin_services_4->id, 'code' => 'DIR_AGRARISCHE_ONTW_ADMINDIENST_SECR'],
			['name' => 'Secretariaat', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $admin_services_4->id, 'code' => 'DIR_AGRARISCHE_ONTW_ADMINDIENST_ALG'],
			['name' => 'Algemene Zaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $admin_services_4->id, 'code' => 'DIR_AGRARISCHE_ONTW_ADMINDIENST_PERSZ'],
			['name' => 'Personeelszaken', 'status' => 'active']
		);
		Department::firstOrCreate(
			['directorate_id' => $dir4->id, 'parent_department_id' => $admin_services_4->id, 'code' => 'DIR_AGRARISCHE_ONTW_ADMINDIENST_BEGR'],
			['name' => 'Begroting & Financiële zaken', 'status' => 'active']
		);
	}
}
