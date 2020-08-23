import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	text = ''
	tipTitle = 'Show all &darr;'
	showAll = false
	styleShow = false
	errorText = ''
	errorExsist = false
	widthCanvas = 600

	onChangeShow() {
		if (this.tipTitle === 'Show all &darr;') {
			this.showAll = true
			this.styleShow = true
			setTimeout(() => {
				this.tipTitle = 'Hide all &uarr;'
			}, 1000)
		} else {
			this.styleShow = false
			setTimeout(() => {
				this.showAll = false
				this.tipTitle = 'Show all &darr;'
			}, 1000)
		}
	}

	parseParams(str: string) {
		const crds = str.trim().split(' [')
		if (crds.length >= 2) {
			const points = []
			for (let i = 1; i < crds.length; i++) {
				const elements = crds[i].trim().split(',')
				if (elements.length === 2) {
					const x = elements[0].trim()
					const y = elements[1].trim().slice(0, elements[1].trim().length - 1).trim()
					if (x !== '' && y !== '' && !isNaN(+x) && !isNaN(+y) && elements[1][elements[1].length - 1] === ']')
						points.push(+x, +y)
					else
						return false
				} else
					return false
			}
			return points
		} else 
			return false
	}

	parseColor(str: string) {
		let color = ''
		const prs = str.split('(')

		if (prs.length === 2 && prs[0][prs[0].length - 1] !== ' ') {
			const name = prs[0].slice(1).trim()
			const atr = prs[1].trim().split(',')

			switch(name) {
				case 'rgb':
					if (atr.length === 3) {
						const r = atr[0].trim() ? +atr[0].trim() : -1
						const g = atr[1].trim() ? +atr[1].trim() : -1
						const b = atr[2].trim().slice(0, atr[2].trim().length - 1).trim() ? +atr[2].trim().slice(0, atr[2].trim().length - 1).trim() : -1
						const check = atr[2].trim()[atr[2].trim().length - 1] === ')'
						if (r >= 0 && r <=255 && g >= 0 && g <=255 && b >= 0 && b <=255 && check) {
							color += name + '(' + r + ', ' + g + ', ' + b + ')'
							return color
						} else
							return false
					} else
						return false
				case 'rgba':
					if (atr.length === 4) {
						const r = +atr[0].trim()
						const g = +atr[1].trim()
						const b = +atr[2].trim()
						const a = +atr[3].slice(0, atr[3].length - 1).trim()
						const check = atr[3].trim()[atr[3].trim().length - 1] === ')'
						if (r >= 0 && r <=255 && g >= 0 && g <=255 && b >= 0 && b <=255 && a >= 0 && a <= 1 && check) {
							color += name + '(' + r + ', ' + g + ', ' + b + ', ' + a +')'
							return color
						} else
							return false
					} else
						return false
				default:
					return false
			}
		} else
			return false
	}

	line(ctx: CanvasRenderingContext2D, points) {
		ctx.moveTo(points[0], points[1])
		ctx.lineTo(points[2], points[3])
		ctx.closePath()
		ctx.stroke()
	}

	drawLine(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 1 && txt.length < 5) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 4) {
					if (txt.length > 2) {
						const beenLitt = []
						mark: for (let i = 2; i < txt.length; i++) {
							const element = txt[i][0]
							if (!beenLitt.includes(element)) {
								switch(element) {
									case 'c':
										const color = this.parseColor(txt[i])
										if (color !== false) {
											beenLitt.push('c')
											ctx.beginPath()
											ctx.strokeStyle = color
											if (i === txt.length - 1) {
												if (!beenLitt.includes('w')) {
													ctx.lineWidth = 1
												}
												this.line(ctx, points)
											}
										} else {
											this.errorText = 'Invalid parameters in the -c option for line.'
											this.errorExsist = true
											break mark
										}
										break;
									
									case 'w':
										const width = +txt[i].slice(1).trim()
										if (!isNaN(width) && width > 0) {
											beenLitt.push('w')
											ctx.lineWidth = width
											if (i === txt.length - 1) {
												if (!beenLitt.includes('c')) {
													ctx.beginPath()
													ctx.strokeStyle = 'black'
												}
												this.line(ctx, points)
											}
										} else {
											this.errorText = 'Invalid parameters in the -w option for line.'
											this.errorExsist = true
											break mark
										}
										break;

									default:
										this.errorText = 'The additional options are incorrectly written for line.'
										this.errorExsist = true
										break mark
								}
							} else {
								this.errorText = 'The additional options are repeated for line.'
								this.errorExsist = true
								break mark
							}
						}

					} else {
						ctx.beginPath()
						ctx.strokeStyle = 'black'
						ctx.lineWidth = 1
						this.line(ctx, points)
					}
				} else {
					this.errorText = 'Invalid coordinates for line.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option for line.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters for line.'
			this.errorExsist = true
		}
	}

	rectangle(ctx: CanvasRenderingContext2D, points) {
		ctx.moveTo(points[0], points[1])
		ctx.lineTo(points[2], points[1])
		ctx.lineTo(points[2], points[3])
		ctx.lineTo(points[0], points[3])
		ctx.lineTo(points[0], points[1])
		ctx.closePath()
		ctx.stroke()
	}

	drawRectangle(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 1 && txt.length < 7) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 4) {
					if (txt.length > 2) {
						const beenLitt = []
						mark: for (let i = 2; i < txt.length; i++) {
							const element = txt[i][0]
							if (!beenLitt.includes(element)) {
								switch(element) {
									case 'c':
										const color = this.parseColor(txt[i])
										if (color !== false) {
											beenLitt.push('c')
											ctx.beginPath()
											ctx.strokeStyle = color
											if (i === txt.length - 1) {
												if (!beenLitt.includes('w'))
													ctx.lineWidth = 1
												this.rectangle(ctx, points)
												if (beenLitt.includes('b'))
													ctx.fill()
											}
										} else {
											this.errorText = 'Invalid parameters in the -c option for rectangle.'
											this.errorExsist = true
											break mark
										}
										break;

									case 'b':
										const back = this.parseColor(txt[i])
										if (back !== false) {
											beenLitt.push('b')
											ctx.fillStyle = back
											if (i === txt.length - 1) {
												if (!beenLitt.includes('c') || !beenLitt.includes('w')) {
													ctx.beginPath()
													if (!beenLitt.includes('c'))
														ctx.strokeStyle = 'black'
													if (!beenLitt.includes('w'))
														ctx.lineWidth = 1
												}
												this.rectangle(ctx, points)
												ctx.fill()
											}
										} else {
											this.errorText = 'Invalid parameters in the -b option for rectangle.'
											this.errorExsist = true
											break mark
										}
										break;
									
									case 'w':
										const width = +txt[i].slice(1).trim()
										if (!isNaN(width) && width > 0) {
											beenLitt.push('w')
											ctx.lineWidth = width
											if (i === txt.length - 1) {
												if (!beenLitt.includes('c')) {
													ctx.beginPath()
													ctx.strokeStyle = 'black'
												}
												this.rectangle(ctx, points)												
												if (beenLitt.includes('b'))
													ctx.fill()
											}
										} else {
											this.errorText = 'Invalid parameters in the -w option for rectangle.'
											this.errorExsist = true
											break mark
										}
										break;

									default:
										this.errorText = 'The additional options are incorrectly written for rectangle.'
										this.errorExsist = true
										break mark
								}
							} else {
								this.errorText = 'The additional options are repeated for rectangle.'
								this.errorExsist = true
								break mark
							}
						}
					} else {
						ctx.beginPath()
						ctx.strokeStyle = 'black'
						ctx.lineWidth = 1
						this.rectangle(ctx, points)
					}
				} else {
					this.errorText = 'Invalid coordinates for rectangle.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option for rectangle.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters for rectangle.'
			this.errorExsist = true
		}
	}

	triangle(ctx: CanvasRenderingContext2D, points) {
		ctx.moveTo(points[0], points[1])
		ctx.lineTo(points[2], points[3])
		ctx.lineTo(points[4], points[5])
		ctx.lineTo(points[0], points[1])
		ctx.closePath()
		ctx.stroke()
	}

	drawTriangle(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 1 && txt.length < 6) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 6) {
					if (txt.length > 2) {
						const beenLitt = []
						mark: for (let i = 2; i < txt.length; i++) {
							const element = txt[i][0]
							if (!beenLitt.includes(element)) {
								switch(element) {
									case 'c':
										const color = this.parseColor(txt[i])
										if (color !== false) {
											beenLitt.push('c')
											ctx.beginPath()
											ctx.strokeStyle = color
											if (i === txt.length - 1) {
												if (!beenLitt.includes('w'))
													ctx.lineWidth = 1
												this.triangle(ctx, points)
												if (beenLitt.includes('b'))
													ctx.fill()
											}
										} else {
											this.errorText = 'Invalid parameters in the -c option for triangle.'
											this.errorExsist = true
											break mark
										}
										break;

									case 'b':
										const back = this.parseColor(txt[i])
										if (back !== false) {
											beenLitt.push('b')
											ctx.fillStyle = back
											if (i === txt.length - 1) {
												if (!beenLitt.includes('c') || !beenLitt.includes('w')) {
													ctx.beginPath()
													if (!beenLitt.includes('w'))
														ctx.lineWidth = 1
													if (!beenLitt.includes('c'))
														ctx.strokeStyle = 'black'
												}
												this.triangle(ctx, points)
												ctx.fill()
											}
										} else {
											this.errorText = 'Invalid parameters in the -b option for triangle.'
											this.errorExsist = true
											break mark
										}
										break;

										case 'w':
											const width = +txt[i].slice(1).trim()
											if (!isNaN(width) && width > 0) {
												beenLitt.push('w')
												ctx.lineWidth = width
												if (i === txt.length - 1) {
													if (!beenLitt.includes('c')) {
														ctx.beginPath()
														ctx.strokeStyle = 'black'
													}
													this.triangle(ctx, points)	
													if (beenLitt.includes('b'))
														ctx.fill()
												}
											} else {
												this.errorText = 'Invalid parameters in the -w option for triangle.'
												this.errorExsist = true
												break mark
											}
											break;

									default:
										this.errorText = 'The additional options are incorrectly written for triangle.'
										this.errorExsist = true
										break mark
								}
							} else {
								this.errorText = 'The additional options are repeated for triangle.'
								this.errorExsist = true
								break mark
							}
						}
					} else {
						ctx.beginPath()
						ctx.strokeStyle = 'black'
						ctx.lineWidth = 1
						this.triangle(ctx, points)
					}
				} else {
					this.errorText = 'Invalid coordinates for triangle.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option for triangle.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters for triangle.'
			this.errorExsist = true
		}
	}

	circle(ctx: CanvasRenderingContext2D, points, radius) {
		ctx.arc(points[0], points[1], radius, 0, 2*Math.PI, false)
		ctx.closePath()
		ctx.stroke()
	}

	drawCircle(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 2 && txt.length < 7) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 2) {
					if (txt[2][0] === 'r') {
						const radius = +txt[2].slice(1).trim()
						if (!isNaN(radius) && radius > 0) {
							if (txt.length > 3) {
								const beenLitt = []
								mark: for (let i = 3; i < txt.length; i++) {
									const element = txt[i][0]
									if (!beenLitt.includes(element)) {
										switch(element) {
											case 'c':
												const color = this.parseColor(txt[i])
												if (color !== false) {
													beenLitt.push('c')
													ctx.beginPath()
													ctx.strokeStyle = color
													if (i === txt.length - 1) {
														if (!beenLitt.includes('w'))
															ctx.lineWidth = 1
														this.circle(ctx, points, radius)
														if (beenLitt.includes('b'))
															ctx.fill()
													}
												} else {
													this.errorText = 'Invalid parameters in the -c option for circle.'
													this.errorExsist = true
													break mark
												}
												break;
		
											case 'b':
												const back = this.parseColor(txt[i])
												if (back !== false) {
													beenLitt.push('b')
													ctx.fillStyle = back
													if (i === txt.length - 1) {
														if (!beenLitt.includes('c') || !beenLitt.includes('w')) {
															ctx.beginPath()
															if (!beenLitt.includes('w'))
																ctx.lineWidth = 1
															if (!beenLitt.includes('c'))
																ctx.strokeStyle = 'black'
														}
														this.circle(ctx, points, radius)
														ctx.fill()
													}													
												} else {
													this.errorText = 'Invalid parameters in the -b option for circle.'
													this.errorExsist = true
													break mark
												}
												break;

												case 'w':
													const width = +txt[i].slice(1).trim()
													if (!isNaN(width) && width > 0) {
														beenLitt.push('w')
														ctx.lineWidth = width
														if (i === txt.length - 1) {
															if (!beenLitt.includes('c')) {
																ctx.beginPath()
																ctx.strokeStyle = 'black'
															}
															this.circle(ctx, points, radius)										
															if (beenLitt.includes('b'))
																ctx.fill()
														}
													} else {
														this.errorText = 'Invalid parameters in the -w option for circle.'
														this.errorExsist = true
														break mark
													}
													break;
		
											default:
												this.errorText = 'The additional options are incorrectly written for circle.'
												this.errorExsist = true
												break mark
										}
									} else {
										this.errorText = 'The additional options are repeated for circle.'
										this.errorExsist = true
										break mark
									}
								}
							} else {
								ctx.beginPath()
								ctx.strokeStyle = 'black'
								ctx.lineWidth = 1
								this.circle(ctx, points, radius)
							}
						} else {
							this.errorText = 'Invalid radius value for circle.'
							this.errorExsist = true	
						}
					} else {
						this.errorText = 'Not found -r option for circle.'
						this.errorExsist = true			
					}
				} else {
					this.errorText = 'Invalid coordinates for circle.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option for circle.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters for circle.'
			this.errorExsist = true
		}
	}

	ellipse(ctx: CanvasRenderingContext2D, points, radius1, radius2) {
		ctx.ellipse(points[0], points[1], radius1, radius2, 0, 0, 2 * Math.PI)
		ctx.closePath()
		ctx.stroke()
	}

	drawEllipse(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 3 && txt.length < 8) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 2) {
					if (txt[2].slice(0, 2) === 'r1' && txt[3].slice(0, 2) === 'r2') {
						const radius1 = +txt[2].slice(2).trim()
						const radius2 = +txt[3].slice(2).trim()
						if (!isNaN(radius1) && !isNaN(radius2) && radius1 > 0 && radius2 > 0) {
							if (txt.length > 4) {
								const beenLitt = []
								mark: for (let i = 4; i < txt.length; i++) {
									const element = txt[i][0]
									if (!beenLitt.includes(element)) {
										switch(element) {
											case 'c':
												const color = this.parseColor(txt[i])
												if (color !== false) {
													beenLitt.push('c')
													ctx.beginPath()
													ctx.strokeStyle = color
													if (i === txt.length - 1) {
														if (!beenLitt.includes('w'))
															ctx.lineWidth = 1
														this.ellipse(ctx, points, radius1, radius2)
														if (beenLitt.includes('b'))
															ctx.fill()
													}
												} else {
													this.errorText = 'Invalid parameters in the -c option  for ellipse.'
													this.errorExsist = true
													break mark
												}
												break;
		
											case 'b':
												const back = this.parseColor(txt[i])
												if (back !== false) {
													beenLitt.push('b')
													ctx.fillStyle = back
													if (i === txt.length - 1) {
														if (!beenLitt.includes('c') || !beenLitt.includes('w')) {
															ctx.beginPath()
															if (!beenLitt.includes('w'))
																ctx.lineWidth = 1
															if (!beenLitt.includes('c'))
																ctx.strokeStyle = 'black'
														}
														this.ellipse(ctx, points, radius1, radius2)
														ctx.fill()
													}													
												} else {
													this.errorText = 'Invalid parameters in the -b option  for ellipse.'
													this.errorExsist = true
													break mark
												}
												break;

												case 'w':
													const width = +txt[i].slice(1).trim()
													if (!isNaN(width) && width > 0) {
														beenLitt.push('w')
														ctx.lineWidth = width
														if (i === txt.length - 1) {
															if (!beenLitt.includes('c')) {
																ctx.beginPath()
																ctx.strokeStyle = 'black'
															}
															this.ellipse(ctx, points, radius1, radius2)	
															if (beenLitt.includes('b'))
																ctx.fill()
														}
													} else {
														this.errorText = 'Invalid parameters in the -w option for ellipse.'
														this.errorExsist = true
														break mark
													}
													break;			
		
											default:
												this.errorText = 'The additional options are incorrectly written  for ellipse.'
												this.errorExsist = true
												break mark
										}
									} else {
										this.errorText = 'The additional options are repeated  for ellipse.'
										this.errorExsist = true
										break mark
									}
								}
							} else {
								ctx.beginPath()
								ctx.strokeStyle = 'black'
								ctx.lineWidth = 1
								this.ellipse(ctx, points, radius1, radius2)
							}
						} else {
							this.errorText = 'Invalid radiuses value  for ellipse.'
							this.errorExsist = true	
						}
					} else {
						this.errorText = 'Not found -r1 or -r2 option  for ellipse.'
						this.errorExsist = true			
					}
				} else {
					this.errorText = 'Invalid coordinates  for ellipse.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option  for ellipse.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters for ellipse.'
			this.errorExsist = true
		}
	}

	star(ctx: CanvasRenderingContext2D, points, count, radius1, radius2) {
		let rot = Math.PI / 2 * 3
		const step = Math.PI / count
		ctx.moveTo(points[0], points[1] - radius2)
		for(let i = 0; i < count; i++) {
			let x = points[0] + Math.cos(rot) * radius2
			let y = points[1] + Math.sin(rot) * radius2
			ctx.lineTo(x, y)
			rot += step

			x = points[0] + Math.cos(rot) * radius1
			y = points[1] + Math.sin(rot) * radius1
			ctx.lineTo(x, y)
			rot += step
		}
		ctx.lineTo(points[0], points[1] - radius2)
		ctx.closePath()
		ctx.stroke()
	}

	drawStar(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 4 && txt.length < 9) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 2) {
					if (txt[2][0] === 'n') {
						const count = +txt[2].slice(1).trim()
						if (!isNaN(count) && count > 3) {
							if (txt[3].slice(0, 2) === 'r1' && txt[4].slice(0, 2) === 'r2') {
								const radius1 = +txt[3].slice(2).trim()
								const radius2 = +txt[4].slice(2).trim()
								if (!isNaN(radius1) && !isNaN(radius2) && radius1 > 0 && radius2 > 0) {
									if (txt.length > 5) {
										const beenLitt = []
										mark: for (let i = 5; i < txt.length; i++) {
											const element = txt[i][0]
											if (!beenLitt.includes(element)) {
												switch(element) {
													case 'c':
														const color = this.parseColor(txt[i])
														if (color !== false) {
															beenLitt.push('c')
															ctx.beginPath()
															ctx.strokeStyle = color

															if (i === txt.length - 1) {
																if (!beenLitt.includes('w'))
																	ctx.lineWidth = 1
																this.star(ctx, points, count, radius1, radius2)
																if (beenLitt.includes('b'))
																	ctx.fill()
															}																
														} else {
															this.errorText = 'Invalid parameters in the -c option for star.'
															this.errorExsist = true
															break mark
														}
														break;
				
													case 'b':
														const back = this.parseColor(txt[i])
														if (back !== false) {
															beenLitt.push('b')
															ctx.fillStyle = back
															if (i === txt.length - 1) {
																if (!beenLitt.includes('c') || !beenLitt.includes('w')) {
																	ctx.beginPath()
																	if (!beenLitt.includes('c'))
																		ctx.strokeStyle = 'black'
																	if (!beenLitt.includes('w'))
																		ctx.lineWidth = 1
																}
																this.star(ctx, points, count, radius1, radius2)
																ctx.fill()
															}															
														} else {
															this.errorText = 'Invalid parameters in the -b option for star.'
															this.errorExsist = true
															break mark
														}
														break;

														case 'w':
															const width = +txt[i].slice(1).trim()
															if (!isNaN(width) && width > 0) {
																beenLitt.push('w')
																ctx.lineWidth = width
																if (i === txt.length - 1) {
																	if (!beenLitt.includes('c')) {
																		ctx.beginPath()
																		ctx.strokeStyle = 'black'
																	}
																	this.star(ctx, points, count, radius1, radius2)	
																	if (beenLitt.includes('b'))
																		ctx.fill()
																}
															} else {
																this.errorText = 'Invalid parameters in the -w option for star.'
																this.errorExsist = true
																break mark
															}
															break;
				
													default:
														this.errorText = 'The additional options are incorrectly written for star.'
														this.errorExsist = true
														break mark
												}
											} else {
												this.errorText = 'The additional options are repeated for star.'
												this.errorExsist = true
												break mark
											}
										}
									} else {
										ctx.beginPath()
										ctx.strokeStyle = 'black'
										ctx.lineWidth = 1
										this.star(ctx, points, count, radius1, radius2)
									}
								} else {
									this.errorText = 'Invalid radiuses value for star.'
									this.errorExsist = true	
								}
							} else {
								this.errorText = 'Not found -r1 or -r2 option for star.'
								this.errorExsist = true			
							}
						} else {
							this.errorText = 'Invalid count value for star.'
							this.errorExsist = true
						}
					} else {
						this.errorText = 'Not found -n option for star.'
						this.errorExsist = true
					}
				} else {
					this.errorText = 'Invalid coordinates for star.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option for star.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters for star.'
			this.errorExsist = true
		}
	}

	onDrawHandler() {
		this.errorText = ''
		this.errorExsist = false

		const figures = this.text.split(';')

		const terminal = <HTMLDivElement> document.querySelector('.terminal')
		this.widthCanvas = terminal.clientWidth

		const canvas = <HTMLCanvasElement> document.querySelector("#canvas")
		if (!canvas.getContext) {
			this.errorText = 'Unsupported code here'
			this.errorExsist = true
			return
		}

		const ctx = canvas.getContext('2d')

		canvas.width = terminal.clientWidth

		for (let i = 0; i < figures.length; i++) {
			const txt = figures[i].split(' -')

			switch(txt[0].trim()) {
				case 'line':
					this.drawLine(txt, ctx)
					break;

				case 'rectangle':
					this.drawRectangle(txt, ctx)
					break;

				case 'triangle':
					this.drawTriangle(txt, ctx)
					break;

				case 'circle':
					this.drawCircle(txt, ctx)
					break;

				case 'ellipse':
					this.drawEllipse(txt, ctx)	
					break;
				
				case 'star':
					this.drawStar(txt, ctx)
					break;

				case '':
					break;

				default:
					this.errorText = 'Incorrect figure name `'+txt[0].trim()+'`.'
					this.errorExsist = true
				}
		}
  }
}
