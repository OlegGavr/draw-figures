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

	onChangeShow() {
		if (this.tipTitle === 'Show all &darr;') {
			this.tipTitle = 'Hide all &uarr;'
			this.showAll = true
			this.styleShow = true
		} else {
			this.tipTitle = 'Show all &darr;'
			this.styleShow = false
			setTimeout(() => {
				this.showAll = false
			}, 1000)
		}
	}

	parseParams(str: string) {
		const crds = str.split(' [')
		const points = []
		for (let i = 1; i < crds.length; i++) {
			const elements = crds[i].split(',')
			const x = +elements[0]
			const y = +elements[1].slice(0, elements[1].length - 1).trim()
			if (!isNaN(x) && !isNaN(y))
				points.push(x, y)
			else
				return false
		}
		return points
	}

	parseColor(str: string) {
		let color = ''
		const prs = str.split('(')
		const name = prs[0].slice(1).trim()
		const atr = prs[1].split(',')

		if (name === 'rgb') {
			if (atr.length === 3) {
				const r = +atr[0].trim()
				const g = +atr[1].trim()
				const b = +atr[2].slice(0, atr[2].length - 1).trim()
				if (r >= 0 && r <=255 && g >= 0 && g <=255 && b >= 0 && b <=255) {
					color += name + '(' + r + ', ' + g + ', ' + b + ')'
					return color
				} else
					return false
			} else
				return false
		} else 
			if (name === 'rgba')
				if (atr.length === 4) {
					const r = +atr[0].trim()
					const g = +atr[1].trim()
					const b = +atr[2].trim()
					const a = +atr[3].slice(0, atr[3].length - 1).trim()
					if (r >= 0 && r <=255 && g >= 0 && g <=255 && b >= 0 && b <=255 && a >= 0 && a <= 1) {
						color += name + '(' + r + ', ' + g + ', ' + b + ', ' + a +')'
						return color
					} else
						return false
				} else
					return false
			else
				return false
	}

	drawLine(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 1 && txt.length < 4) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 4) {
					if (txt.length === 3) {
						if (txt[2][0] === 'c') {
							const color = this.parseColor(txt[2])
							if (color !== false) {
								ctx.strokeStyle = color
								ctx.moveTo(points[0], points[1])
								ctx.lineTo(points[2], points[3])
								ctx.stroke()
							} else {
								this.errorText = 'Invalid parameters in the -c option.'
								this.errorExsist = true
							}
						} else {
							this.errorText = 'Not found -c option.'
							this.errorExsist = true
						}
					} else {
						ctx.strokeStyle = 'black'
						ctx.moveTo(points[0], points[1])
						ctx.lineTo(points[2], points[3])
						ctx.stroke()
					}
				} else {
					this.errorText = 'Invalid coordinates.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters.'
			this.errorExsist = true
		}
	}

	drawRectangle(txt: string[], ctx: CanvasRenderingContext2D) {
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
											ctx.strokeStyle = color
											ctx.strokeRect(points[0], points[1], points[2], points[3])
										} else {
											this.errorText = 'Invalid parameters in the -c option.'
											this.errorExsist = true
											break mark
										}
										break;

									case 'b':
										const back = this.parseColor(txt[i])
										if (back !== false) {
											beenLitt.push('b')
											ctx.fillStyle = back
											if (!beenLitt.includes('c') && i === txt.length - 1) {
												ctx.strokeStyle = 'black'
												ctx.strokeRect(points[0], points[1], points[2], points[3])
											}
											ctx.fillRect(points[0], points[1], points[2], points[3])
										} else {
											this.errorText = 'Invalid parameters in the -b option.'
											this.errorExsist = true
											break mark
										}
										break;

									default:
										this.errorText = 'The additional options are incorrectly written.'
										this.errorExsist = true
										break mark
								}
							} else {
								this.errorText = 'The additional options are repeated.'
								this.errorExsist = true
								break mark
							}
						}
					} else {
						ctx.strokeStyle = 'black'
						ctx.strokeRect(points[0], points[1], points[2], points[3])
					}
				} else {
					this.errorText = 'Invalid coordinates.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters.'
			this.errorExsist = true
		}
	}

	drawTriangle(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 1 && txt.length < 5) {
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
											ctx.strokeStyle = color
											ctx.moveTo(points[0], points[1])
											ctx.lineTo(points[2], points[3])
											ctx.lineTo(points[4], points[5])
											ctx.lineTo(points[0], points[1])
											ctx.stroke()
											if (beenLitt.includes('b') && i === txt.length - 1) {
												ctx.fill()
											}
										} else {
											this.errorText = 'Invalid parameters in the -c option.'
											this.errorExsist = true
											break mark
										}
										break;

									case 'b':
										const back = this.parseColor(txt[i])
										if (back !== false) {
											beenLitt.push('b')
											ctx.fillStyle = back
											if (!beenLitt.includes('c') && i === txt.length - 1) {
												ctx.strokeStyle = 'black'
												ctx.moveTo(points[0], points[1])
												ctx.lineTo(points[2], points[3])
												ctx.lineTo(points[4], points[5])
												ctx.lineTo(points[0], points[1])
												ctx.stroke()
											}
											ctx.fill()
										} else {
											this.errorText = 'Invalid parameters in the -b option.'
											this.errorExsist = true
											break mark
										}
										break;

									default:
										this.errorText = 'The additional options are incorrectly written.'
										this.errorExsist = true
										break mark
								}
							} else {
								this.errorText = 'The additional options are repeated.'
								this.errorExsist = true
								break mark
							}
						}
					} else {
						ctx.strokeStyle = 'black'
						ctx.moveTo(points[0], points[1])
						ctx.lineTo(points[2], points[3])
						ctx.lineTo(points[4], points[5])
						ctx.lineTo(points[0], points[1])
						ctx.stroke()
					}
				} else {
					this.errorText = 'Invalid coordinates.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters.'
			this.errorExsist = true
		}
	}

	drawCircle(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 2 && txt.length < 6) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 2) {
					if (txt[2][0] === 'r') {
						const radius = +txt[2].slice(1).trim()
						if (!isNaN(radius)) {
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
													ctx.strokeStyle = color
													ctx.arc(points[0], points[1], radius, 0, 2*Math.PI, false)
													ctx.stroke()
													if (beenLitt.includes('b') && i === txt.length - 1) {
														ctx.fill()
													}
												} else {
													this.errorText = 'Invalid parameters in the -c option.'
													this.errorExsist = true
													break mark
												}
												break;
		
											case 'b':
												const back = this.parseColor(txt[i])
												if (back !== false) {
													beenLitt.push('b')
													ctx.fillStyle = back
													if (!beenLitt.includes('c') && i === txt.length - 1) {
														ctx.strokeStyle = 'black'
														ctx.arc(points[0], points[1], radius, 0, 2*Math.PI, false)
														ctx.stroke()
													}
													ctx.fill()
												} else {
													this.errorText = 'Invalid parameters in the -b option.'
													this.errorExsist = true
													break mark
												}
												break;
		
											default:
												this.errorText = 'The additional options are incorrectly written.'
												this.errorExsist = true
												break mark
										}
									} else {
										this.errorText = 'The additional options are repeated.'
										this.errorExsist = true
										break mark
									}
								}
							} else {
								ctx.strokeStyle = 'black'
								ctx.arc(points[0], points[1], radius, 0, 2*Math.PI, false)
								ctx.stroke()
							}
						} else {
							this.errorText = 'Invalid radius value.'
							this.errorExsist = true	
						}
					} else {
						this.errorText = 'Not found -r option.'
						this.errorExsist = true			
					}
				} else {
					this.errorText = 'Invalid coordinates.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters.'
			this.errorExsist = true
		}
	}

	drawEllipse(txt: string[], ctx: CanvasRenderingContext2D) {
		if (txt.length > 3 && txt.length < 7) {
			if (txt[1][0] === 'p') {
				const points = this.parseParams(txt[1])
				if (points !== false && points.length === 2) {
					if (txt[2].slice(0, 2) === 'r1' && txt[3].slice(0, 2) === 'r2') {
						const radius1 = +txt[2].slice(2).trim()
						const radius2 = +txt[3].slice(2).trim()
						if (!isNaN(radius1) && !isNaN(radius2)) {
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
													ctx.strokeStyle = color
													ctx.ellipse(points[0], points[1], radius1, radius2, 0, 0, 2 * Math.PI)
													ctx.stroke()
													if (beenLitt.includes('b') && i === txt.length - 1) {
														ctx.fill()
													}
												} else {
													this.errorText = 'Invalid parameters in the -c option.'
													this.errorExsist = true
													break mark
												}
												break;
		
											case 'b':
												const back = this.parseColor(txt[i])
												if (back !== false) {
													beenLitt.push('b')
													ctx.fillStyle = back
													if (!beenLitt.includes('c') && i === txt.length - 1) {
														ctx.strokeStyle = 'black'
														ctx.ellipse(points[0], points[1], radius1, radius2, 0, 0, 2 * Math.PI)
														ctx.stroke()
													}
													ctx.fill()
												} else {
													this.errorText = 'Invalid parameters in the -b option.'
													this.errorExsist = true
													break mark
												}
												break;
		
											default:
												this.errorText = 'The additional options are incorrectly written.'
												this.errorExsist = true
												break mark
										}
									} else {
										this.errorText = 'The additional options are repeated.'
										this.errorExsist = true
										break mark
									}
								}
							} else {
								ctx.strokeStyle = 'black'
								ctx.ellipse(points[0], points[1], radius1, radius2, 0, 0, 2 * Math.PI)
								ctx.stroke()
							}
						} else {
							this.errorText = 'Invalid radiuses value.'
							this.errorExsist = true	
						}
					} else {
						this.errorText = 'Not found -r1 or -r2 option.'
						this.errorExsist = true			
					}
				} else {
					this.errorText = 'Invalid coordinates.'
					this.errorExsist = true
				}
			} else {
				this.errorText = 'Not found -p option.'
				this.errorExsist = true
			}
		} else {
			this.errorText = 'Invalid number of parameters.'
			this.errorExsist = true
		}
	}

	onDrawHandler() {
		this.errorText = ''
		this.errorExsist = false

		const txt = this.text.split(' -')
		const canvas = <HTMLCanvasElement> document.querySelector("#canvas")
		const ctx = canvas.getContext('2d')
		canvas.width = canvas.width

		switch(txt[0]) {
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

			default:
				this.errorText = 'Incorrect figure name.'
				this.errorExsist = true
			}



    // ctx.lineWidth = 3; // толщина линии
  }
}
