import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'


export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        })
        return
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}
