const DeveloperOptions = ({ setShowApiTester }) => (
  <section className="settings-card">
    <h2 className="card-title">Opciones de Desarrollador</h2>
    <label className="custom-checkbox">
      <input type="checkbox" onChange={(event) => setShowApiTester(event.target.checked)} />
      <span className="checkmark"></span>
      <span>Mostrar Probador de API</span>
    </label>
  </section>
);

export default DeveloperOptions;
