import React, { useState } from 'react';
import { api } from './../../back/api_client'; 

const ApiTester = () => {
    const [status, setStatus] = useState('Esperando prueba...');

    const runTests = async () => {
        try {
            console.log('--- Iniciando pruebas de API ---');
            
            // 1. Probar Login
            console.log('Probando Login...');
            // Nota: Asegúrate de tener este usuario creado en tu BD para que la prueba sea exitosa
            const loginRes = await api.login('admin', 'change-me-before-first-start');
            console.log('Login Result:', loginRes);

            // 2. Probar GetMe (Verifica el Mapper mapUserDTO)
            console.log('Probando GetMe...');
            const me = await api.getMe();
            console.log('User Profile (Mapped):', me);

            // 3. Probar Listar Usuarios (Verifica mapUserDTO en array)
            console.log('Probando Listar Usuarios...');
            const users = await api.listUsers();
            console.log('Users List (Mapped):', users);

            setStatus('Pruebas completadas. Revisa la consola.');
        } catch (error) {
            console.error('Error en las pruebas:', error);
            setStatus(`Error: ${error.message}. Revisa la consola.`);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>Probador de API</h2>
            <p>Estado: {status}</p>
            <button onClick={runTests} style={{ padding: '10px', cursor: 'pointer' }}>
                Ejecutar Pruebas
            </button>
        </div>
    );
};

export default ApiTester;
