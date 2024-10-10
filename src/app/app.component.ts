import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuarios.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' }; // id agregado
  idModificar: number = 0;
  usuarioModificar: Usuario | null = null; // Usuario a modificar
  idEliminar: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id,  // id agregado aquí
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post('https://jsonplaceholder.typicode.com/users', body)
      .subscribe(response => {
        console.log('Usuario agregado:', response);
        this.usuarios.push({ ...this.nuevoUsuario, id: (response as any).id }); // id del nuevo usuario
        this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' }; // Limpiar el formulario
      });
  }

  cargarDatosUsuario() {
    if (this.idModificar) {
      this.http.get<any>(`https://jsonplaceholder.typicode.com/users/${this.idModificar}`)
        .subscribe(user => {
          this.usuarioModificar = {
            id: user.id,  // Agregar el id aquí también
            nombre: user.name,
            email: user.email,
            empresa: user.company.name
          };
        });
    }
  }

  modificarUsuario() {
    if (this.usuarioModificar && this.idModificar) {
      const body = {
        name: this.usuarioModificar.nombre,
        email: this.usuarioModificar.email,
        company: {
          name: this.usuarioModificar.empresa
        }
      };

      this.http.put(`https://jsonplaceholder.typicode.com/users/${this.idModificar}`, body)
        .subscribe(response => {
          console.log('Usuario modificado:', response);
          this.usuarioModificar = null;
          this.idModificar = 0;
          this.obtenerUsuarios(); // Actualiza la lista de usuarios
        });
    }
  }

  eliminarUsuario() {
    if (this.idEliminar) {
      this.http.delete(`https://jsonplaceholder.typicode.com/users/${this.idEliminar}`)
        .subscribe(() => {
          console.log('Usuario eliminado');
          this.usuarios = this.usuarios.filter(user => user.id !== this.idEliminar); // Filtro corregido
          this.idEliminar = 0;
        });
    }
  }
}

