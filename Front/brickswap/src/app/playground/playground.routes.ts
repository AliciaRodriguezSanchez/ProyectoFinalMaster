export const routes = [
  {
  path: 'playground',
  loadComponent: () =>
    import('../playground/playground.component')
      .then(c => c.PlaygroundComponent)
}
];