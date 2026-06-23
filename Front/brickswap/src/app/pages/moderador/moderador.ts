import { Component, signal } from '@angular/core';
import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';
import { IStat } from '../../interfaces/istat.interface';
import { ReportService } from '../../core/services/report/report.service';
import { CardPanelComponent } from '../../shared/card-panel/card-panel.component';
import { IReportsTable } from '../../interfaces/ireports-table.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IPendingTable } from '../../interfaces/ipending-table.interface';
import { TableComponent } from '../../shared/table/table.component';
import { ReportViewComponent } from '../../shared/components/report-view/report-view.component';

// Define los estados exactos que te devuelve la base de datos
const CONFIGURACION_ESTADOS: Record<string, { icon: string, color: string }> = {
  'Pendiente': { 
    icon: 'bi bi-exclamation-triangle small', 
    color: 'text-warning' 
  },
  'Revisado_Mantenido': { 
    icon: 'bi-check-circle-fill', 
    color: 'text-success' 
  },
  'Revisado_Retirado': { 
    icon: 'bi-x-circle-fill', 
    color: 'text-danger' 
  },
  'default': { 
    icon: 'bi-info-circle', 
    color: 'text-primary' 
  }
};

@Component({
  selector: 'app-moderador',
  imports:[TitleComponent, DescriptionsComponent, CardPanelComponent, TableComponent, ReportViewComponent],
  templateUrl: './moderador.html',
  styleUrl: './moderador.css',
})
export class ModeradorPage {

  totalStadistics=signal<IStat[]>([]);
  reportsTables= signal<IPendingTable[]>([]);
  estadoActual = signal<string>('Pendiente');

  constructor(
    private reportServices: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
      this.obtenerEstadisticas();
      this.route.queryParams.subscribe(async (params) => {
        const estadoActivo = params['estado'] || 'Pendiente';
        this.estadoActual.set(estadoActivo);
        await this.cargarDatosTabla(estadoActivo);
      })
  };

  ordenarAscendente: boolean = false; // Falso = más reciente primero

  cambiarOrden() {
    this.ordenarAscendente = !this.ordenarAscendente;
    
    // Ordenamos el array actual que tienes en la señal
    const listaActual = [...this.reportsTables()];
    
    listaActual.sort((a, b) => {
      const fechaA = new Date(a.time).getTime();
      const fechaB = new Date(b.time).getTime();
      return this.ordenarAscendente ? fechaA - fechaB : fechaB - fechaA;
    });

    this.reportsTables.set(listaActual);
  }

  cambiarEstadoUrl(estadoSeleccionado: string){
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams: {estado: estadoSeleccionado},
      queryParamsHandling: 'merge'
    });
  }

  async cargarDatosTabla(estado:string){
    try{
      const datosBackend = await this.reportServices.stateReports(estado);

      const datosMapeados = datosBackend.map((item: any) => ({
        id: item.id, 
        title: item.titulo,
        customer: item.nombre,
        reason: item.motivo,
        time: item.fecha_reporte,
        status: item.estado_reporte,
        resolution: item.resolucion_comentario
      }));
      this.reportsTables.set(datosMapeados);
      console.log('Datos de la tabla', datosMapeados);
    }catch (error){
      console.error('Error al obtener los datos de la tabla', error);
    }
  }

  async obtenerEstadisticas(){
    try{
      const backEndData = await this.reportServices.stateStadistics();
      const datosMapeados = backEndData.map((dato: any) =>{
        const configVisual = CONFIGURACION_ESTADOS[dato.Estado] || CONFIGURACION_ESTADOS['default'];

        return {
          label: dato.Estado,
          stadistics: dato.total_reportes,
          icon: configVisual.icon,
          color: configVisual.color
        };
      });
      const ordenDeseado: Record<string, number> = {
        'Pendiente': 1,
        'Revisado_Retirado': 2,  
        'Revisado_Mantenido': 3  
      };

      datosMapeados.sort((a, b) => {
        const pesoA = ordenDeseado[a.label] || 99;
        const pesoB = ordenDeseado[b.label] || 99;
        return pesoA - pesoB;
      });

      this.totalStadistics.set(datosMapeados);
      console.log('Datos Obtenidos:', datosMapeados);
    }catch (error){
      console.log('Error al cargar las estadisticas:',error);
    }
  }

  async guardarResolucion(datosResolucion: {id: number, estado: string, resolucion: string}){

    try{
      await this.reportServices.actualizarReporte(datosResolucion);
  
      const reportesActuales = this.reportsTables();
  
      const reportesActualizados = reportesActuales.filter((r:any) =>
        r.id !== datosResolucion.id);
  
      this.reportsTables.set(reportesActualizados);

      await this.obtenerEstadisticas();
      console.log(datosResolucion.id);
      console.log('Reporte resuelto y eliminado de la vista');
    }catch (error){
      console.log('Error al guardar la resolución del reporte:',error);
    }
  }
}
