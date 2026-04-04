package com.moa.party.domain;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import lombok.Getter;

@Getter
public enum RefundPolicy {

	FULL_REFUND("전액 환불", 1.0),
	TWO_THIRDS_REFUND("2/3 환불", 2.0 / 3.0),
	NO_REFUND("환불 불가", 0.0);

	private final String label;
	private final double refundRatio;

	RefundPolicy(String label, double refundRatio) {
		this.label = label;
		this.refundRatio = refundRatio;
	}

	public static RefundPolicy determine(LocalDateTime startDate, LocalDateTime withdrawDate) {
		if (withdrawDate == null) {
			withdrawDate = LocalDateTime.now();
		}

		if (startDate == null || withdrawDate.isBefore(startDate)) {
			long daysUntilStart = ChronoUnit.DAYS.between(withdrawDate, startDate);
			if (daysUntilStart >= 7) {
				return FULL_REFUND;
			}
			return TWO_THIRDS_REFUND;
		}

		long totalDays = ChronoUnit.DAYS.between(startDate, startDate.plusMonths(1));
		long elapsedDays = ChronoUnit.DAYS.between(startDate, withdrawDate);

		if (elapsedDays <= totalDays / 3) {
			return TWO_THIRDS_REFUND;
		}
		return NO_REFUND;
	}

	public int calculateRefundAmount(int originalAmount) {
		return (int) Math.round(originalAmount * refundRatio);
	}
}
