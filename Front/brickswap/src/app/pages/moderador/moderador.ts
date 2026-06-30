import { Component, signal } from '@angular/core';
import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';
import { IStat } from '../../interfaces/istat.interface';
import { ReportService } from '../../core/services/report/report.service';
import { CardPanelComponent } from '../../shared/card-panel/card-panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IPendingTable } from '../../interfaces/ipending-table.interface';
import { TableComponent } from '../../shared/table/table.component';
import { ArticleService } from '../../core/services/article/article.service';

const CONFIGURACION_ESTADOS: Record<string, { icon: string, color: string, bgClass: string, nombreMostrar: string }> = {
  'Pendiente': {
    icon: 'bi bi-exclamation-triangle small',
    color: 'text-warning',
    bgClass: 'bg-warning-subtle',
    nombreMostrar: 'Pendientes'
  },
  'Revisado_Mantenido': {
    icon: 'bi-check-circle-fill',
    color: 'text-success',
    bgClass: 'bg-success-subtle',
    nombreMostrar: 'Aceptados'
  },
  'Revisado_Retirado': {
    icon: 'bi-x-circle-fill',
    color: 'text-danger',
    bgClass: 'bg-danger-subtle',
    nombreMostrar: 'Rechazados'
  },
  'default': {
    icon: 'bi-info-circle',
    color: 'text-primary',
    bgClass: 'bg-primary-subtle',
    nombreMostrar: 'Otros'
  }
};

@Component({
  selector: 'app-moderador',
  imports:[TitleComponent, DescriptionsComponent, CardPanelComponent, TableComponent],
  templateUrl: './moderador.html',
  styleUrl: './moderador.css',
})
export class ModeradorPage {

  totalStadistics=signal<IStat[]>([]);
  reportsTables= signal<IPendingTable[]>([]);
  estadoActual = signal<string>('Pendiente');

  constructor(
    private reportServices: ReportService,
    private articleService: ArticleService,
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

  ordenarAscendente: boolean = false; 

  cambiarOrden() {
    this.ordenarAscendente = !this.ordenarAscendente;
    
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
        title: item.titulo || `Artículo #${item.articulo_id}`,
        customer: item.nombre,
        reason: item.motivo,
        time: item.fecha_reporte,
        status: item.estado_reporte,
        resolution: item.resolucion_comentario,
        article_id: item.articulo_id
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
          nombreMostrar: configVisual.nombreMostrar,
          stadistics: dato.total_reportes,
          icon: configVisual.icon,
          color: configVisual.color,
          bgClass: configVisual.bgClass
        };
      });

      const estadosBase = ['Pendiente', 'Revisado_Retirado', 'Revisado_Mantenido'];
      estadosBase.forEach(estado => {
        if (!datosMapeados.some((d: any) => d.label === estado)) {
          const configVisual = CONFIGURACION_ESTADOS[estado] || CONFIGURACION_ESTADOS['default'];
          datosMapeados.push({
            label: estado,
            nombreMostrar: configVisual.nombreMostrar,
            stadistics: 0,
            icon: configVisual.icon,
            color: configVisual.color,
            bgClass: configVisual.bgClass
          });
        }
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

  async guardarResolucion(datosResolucion: {id: number, estado: string, resolucion: string, estado_revision:string}){

    try{
      await this.reportServices.actualizarReporte(datosResolucion);
      console.log('Estos son los dtaos de Resolución',datosResolucion);

      const reportesActuales = this.reportsTables();
      
      const reporteActual = reportesActuales.find((r:any) => r.id == datosResolucion.id);
      console.log('Reporte Actula info', reporteActual);

      const idArticulo = reporteActual?.article_id;

      if(idArticulo){
        await this.articleService.updateState(idArticulo, datosResolucion.estado_revision);
        console.log('Estado del artículo actualizado', idArticulo, datosResolucion.estado_revision);
      }else{
        console.error('No se encontró el articulo_id en el reporte actual')
      }
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
